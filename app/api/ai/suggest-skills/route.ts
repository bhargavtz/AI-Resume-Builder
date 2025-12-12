import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, getRateLimitInfo } from "@/lib/rate-limit";
import { sanitizeForAI, sanitizeJobTitle, sanitizeArray } from "@/lib/sanitize";
import { withRetry, aiCircuitBreaker } from "@/lib/retry";
import { LIMITS } from "@/lib/constants";
import logger from "@/lib/logger";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();
        if (!userId) {
            logger.warn("Unauthorized AI skills request", {}, undefined, requestId);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        logger.apiRequest('POST', '/api/ai/suggest-skills', userId, requestId);

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

        const { jobTitle, industry, currentSkills } = await req.json();

        if (!jobTitle) {
            return NextResponse.json({ message: "Job title is required" }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedJobTitle = sanitizeJobTitle(jobTitle);
        const sanitizedIndustry = industry ? sanitizeForAI(industry, 100) : '';
        const sanitizedSkills = currentSkills ? sanitizeArray(currentSkills) : [];

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Suggest relevant skills for a ${sanitizedJobTitle} position${sanitizedIndustry ? ` in the ${sanitizedIndustry} industry` : ''}.

${sanitizedSkills.length ? `Already listed skills: ${sanitizedSkills.join(', ')}` : ''}

Requirements:
- Suggest 10 skills that would be valuable for this role
- Include a mix of technical and soft skills
- Order by relevance (most important first)
- Do NOT repeat skills already listed
- Focus on in-demand, ATS-friendly keywords

Return as a JSON array of objects with this format:
[
    { "name": "Skill Name", "category": "Technical", "importance": "High" },
    { "name": "Skill Name", "category": "Soft", "importance": "Medium" }
]

Return ONLY valid JSON, no markdown formatting.`;

        // Wrap AI call in retry logic and circuit breaker
        const text = await aiCircuitBreaker.execute(async () => {
            return await withRetry(async () => {
                logger.debug("Calling Gemini API for skill suggestions", { jobTitle: sanitizedJobTitle }, userId, requestId);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            }, {
                maxRetries: 3,
                initialDelayMs: 1000,
                maxDelayMs: 5000,
            });
        });

        let skills;
        try {
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            skills = JSON.parse(cleanedText);
        } catch (parseError) {
            // Fallback: parse as simple array
            skills = text.split('\n')
                .filter(line => line.trim())
                .map(line => ({ name: line.replace(/^[-•*\d.]\s*/, '').trim(), category: 'Technical', importance: 'Medium' }))
                .slice(0, 10);
        }

        logger.info("AI skills suggested successfully", { count: skills.length }, userId, requestId);

        const info = getRateLimitInfo(userId, LIMITS.RATE_LIMIT_AI);
        return NextResponse.json({ skills }, {
            headers: {
                'X-RateLimit-Remaining': info.remaining.toString(),
                'X-Request-ID': requestId
            }
        });

    } catch (error: any) {
        logger.apiError('POST', '/api/ai/suggest-skills', error, undefined, requestId);

        // Handle circuit breaker
        if (error.message?.includes('Circuit breaker is OPEN')) {
            return NextResponse.json({
                message: "AI service is temporarily unavailable. Please try again in a minute.",
            }, { status: 503 });
        }

        return NextResponse.json({
            message: "Failed to suggest skills",
        }, { status: 500 });
    }
}
