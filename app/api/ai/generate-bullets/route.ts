import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, getRateLimitInfo } from "@/lib/rate-limit";
import { sanitizeForAI, sanitizeJobTitle } from "@/lib/sanitize";
import { withRetry, aiCircuitBreaker } from "@/lib/retry";
import { LIMITS } from "@/lib/constants";
import logger from "@/lib/logger";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();
        if (!userId) {
            logger.warn("Unauthorized AI bullets request", {}, undefined, requestId);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        logger.apiRequest('POST', '/api/ai/generate-bullets', userId, requestId);

        // Rate limiting
        if (!checkRateLimit(userId, LIMITS.RATE_LIMIT_AI, LIMITS.RATE_LIMIT_WINDOW_MS)) {
            const info = getRateLimitInfo(userId, LIMITS.RATE_LIMIT_AI);
            logger.warn("Rate limit exceeded", { userId }, userId, requestId);
            return NextResponse.json({
                message: "Rate limit exceeded. Please try again later.",
                retryAfter: info.resetIn
            }, { status: 429 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger.error("Gemini API key not configured", {}, userId, requestId);
            return NextResponse.json({
                message: "AI service temporarily unavailable"
            }, { status: 503 });
        }

        const { jobTitle, experience, skills, context } = await req.json();

        if (!context) {
            return NextResponse.json({
                message: "Context is required (e.g., 'experience' or 'project')"
            }, { status: 400 });
        }

        // Sanitize inputs - NOW APPLIED!
        const sanitizedJobTitle = jobTitle ? sanitizeJobTitle(jobTitle) : '';
        const sanitizedExperience = experience ? sanitizeForAI(experience, LIMITS.MAX_AI_INPUT_LENGTH) : '';
        const sanitizedSkills = skills ? sanitizeForAI(skills, LIMITS.MAX_AI_SKILLS_LENGTH) : '';

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Generate 3-4 professional resume bullet points for a ${sanitizedJobTitle || "professional"}.

Context: ${context}
${sanitizedExperience ? `Experience Details: ${sanitizedExperience}` : ""}
${sanitizedSkills ? `Relevant Skills: ${sanitizedSkills}` : ""}

Requirements:
- Start each bullet with a strong action verb
- Include quantifiable achievements where possible (use realistic numbers)
- Be specific and results-oriented
- Keep each bullet to 1-2 lines maximum
- Make them ATS-friendly with relevant keywords
- Do not use generic phrases or placeholders

Return ONLY the bullet points as a JSON array of strings, for example:
["Bullet 1", "Bullet 2", "Bullet 3"]`;

        // Wrap AI call in retry logic and circuit breaker
        const text = await aiCircuitBreaker.execute(async () => {
            return await withRetry(async () => {
                logger.debug("Calling Gemini API for bullets", { context }, userId, requestId);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            }, {
                maxRetries: 3,
                initialDelayMs: 1000,
                maxDelayMs: 5000,
            });
        });

        // Parse JSON array from response
        let bullets;
        try {
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            bullets = JSON.parse(cleanedText);
        } catch (parseError) {
            // If parsing fails, split by newlines
            bullets = text
                .split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[-•*]\s*/, '').trim())
                .filter(line => line.length > 10);
        }

        logger.info("AI bullets generated successfully", { count: bullets.length }, userId, requestId);

        const info = getRateLimitInfo(userId, LIMITS.RATE_LIMIT_AI);
        return NextResponse.json({ bullets }, {
            headers: {
                'X-RateLimit-Remaining': info.remaining.toString(),
                'X-Request-ID': requestId
            }
        });

    } catch (error: any) {
        logger.apiError('POST', '/api/ai/generate-bullets', error, undefined, requestId);

        // Handle circuit breaker
        if (error.message?.includes('Circuit breaker is OPEN')) {
            return NextResponse.json({
                message: "AI service is temporarily unavailable. Please try again in a minute.",
            }, { status: 503 });
        }

        // Handle Gemini API rate limit errors
        if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
            return NextResponse.json({
                message: "AI service is temporarily busy. Please try again in a minute.",
            }, { status: 429 });
        }

        return NextResponse.json({
            message: "Failed to generate bullet points. Please try again.",
        }, { status: 500 });
    }
}
