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
            logger.warn("Unauthorized AI summary request", {}, undefined, requestId);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        logger.apiRequest('POST', '/api/ai/generate-summary', userId, requestId);

        // Rate limiting
        if (!checkRateLimit(userId, LIMITS.RATE_LIMIT_AI, LIMITS.RATE_LIMIT_WINDOW_MS)) {
            const info = getRateLimitInfo(userId, LIMITS.RATE_LIMIT_AI);
            logger.warn("Rate limit exceeded", { userId, remaining: info.remaining }, userId, requestId);
            return NextResponse.json({
                message: "Rate limit exceeded. Please try again later.",
                retryAfter: info.resetIn
            }, {
                status: 429,
                headers: {
                    'Retry-After': info.resetIn.toString(),
                    'X-RateLimit-Remaining': info.remaining.toString()
                }
            });
        }

        // Check API key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger.error("Gemini API key not configured", {}, userId, requestId);
            return NextResponse.json({
                message: "AI service temporarily unavailable"
            }, { status: 503 });
        }

        const { jobTitle, experience, skills } = await req.json();

        if (!jobTitle) {
            return NextResponse.json({ message: "Job title is required" }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedJobTitle = sanitizeJobTitle(jobTitle);

        // Parse experience array to string if needed
        let experienceText = '';
        if (Array.isArray(experience)) {
            experienceText = experience.map((exp: any) => {
                const title = exp.title || '';
                const company = exp.companyName || '';
                return `${title} ${company ? `at ${company}` : ''}`;
            }).filter(Boolean).join('. ');
        } else {
            experienceText = String(experience || '');
        }

        // Parse skills array to string if needed
        let skillsText = '';
        if (Array.isArray(skills)) {
            skillsText = skills.map((skill: any) => skill.name).filter(Boolean).join(', ');
        } else {
            skillsText = String(skills || '');
        }

        const sanitizedExperience = experienceText ? sanitizeForAI(experienceText, LIMITS.MAX_AI_INPUT_LENGTH) : '';
        const sanitizedSkills = skillsText ? sanitizeForAI(skillsText, LIMITS.MAX_AI_SKILLS_LENGTH) : '';

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Generate a professional resume summary for a ${sanitizedJobTitle} with the following details:
${sanitizedExperience ? `Experience: ${sanitizedExperience}` : ""}
${sanitizedSkills ? `Key Skills: ${sanitizedSkills}` : ""}

Requirements:
- Write 2-3 sentences maximum
- Be concise and impactful
- Include relevant keywords for ATS systems
- Highlight key achievements or strengths
- Use active voice and strong action words
- Do not include placeholder text like [Company Name]

Return ONLY the summary text, no quotes or additional formatting.`;

        // Wrap AI call in retry logic and circuit breaker
        const summary = await aiCircuitBreaker.execute(async () => {
            return await withRetry(async () => {
                logger.debug("Calling Gemini API for summary", { jobTitle: sanitizedJobTitle }, userId, requestId);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            }, {
                maxRetries: 3,
                initialDelayMs: 1000,
                maxDelayMs: 5000,
            });
        });

        logger.info("AI summary generated successfully", { length: summary.length }, userId, requestId);

        // Add rate limit info to response headers
        const info = getRateLimitInfo(userId, LIMITS.RATE_LIMIT_AI);
        return NextResponse.json({ summary }, {
            headers: {
                'X-RateLimit-Remaining': info.remaining.toString(),
                'X-RateLimit-Reset': info.resetIn.toString(),
                'X-Request-ID': requestId
            }
        });

    } catch (error: any) {
        logger.apiError('POST', '/api/ai/generate-summary', error, undefined, requestId);

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
            message: "Failed to generate summary. Please try again.",
        }, { status: 500 });
    }
}
