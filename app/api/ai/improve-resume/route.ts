import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, getRateLimitInfo } from "@/lib/rate-limit";
import { sanitizeResumeContent, sanitizeJobTitle } from "@/lib/sanitize";
import { withRetry, aiCircuitBreaker } from "@/lib/retry";
import { LIMITS } from "@/lib/constants";
import logger from "@/lib/logger";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();
        if (!userId) {
            logger.warn("Unauthorized improve resume request", {}, undefined, requestId);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        logger.apiRequest('POST', '/api/ai/improve-resume', userId, requestId);

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

        const { resumeContent, targetJobTitle } = await req.json();

        if (!resumeContent) {
            return NextResponse.json({ message: "Resume content is required" }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedContent = sanitizeResumeContent(resumeContent);
        const sanitizedJobTitle = targetJobTitle ? sanitizeJobTitle(targetJobTitle) : '';

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Review this resume and provide specific, actionable improvement suggestions.

Resume Data:
${JSON.stringify(sanitizedContent, null, 2)}

${sanitizedJobTitle ? `Target Role: ${sanitizedJobTitle}` : ''}

Analyze and provide suggestions in the following JSON format:
{
    "overallScore": 75,
    "summary": "2-3 sentence overall assessment",
    "sections": {
        "personalDetails": {
            "score": 8,
            "suggestions": ["suggestion1", "suggestion2"]
        },
        "summary": {
            "score": 6,
            "suggestions": ["suggestion1", "suggestion2"]
        },
        "experience": {
            "score": 7,
            "suggestions": ["suggestion1", "suggestion2"]
        },
        "education": {
            "score": 8,
            "suggestions": ["suggestion1"]
        },
        "skills": {
            "score": 7,
            "suggestions": ["suggestion1", "suggestion2"]
        }
    },
    "topPriorities": ["priority1", "priority2", "priority3"],
    "missingKeywords": ["keyword1", "keyword2"]
}

Focus on:
1. Quantifiable achievements (numbers, percentages)
2. Action verbs usage
3. Keyword optimization for ATS
4. Content relevance to target role
5. Professional formatting

Return ONLY valid JSON.`;

        // Wrap AI call in retry logic and circuit breaker
        const text = await aiCircuitBreaker.execute(async () => {
            return await withRetry(async () => {
                logger.debug("Calling Gemini API for resume improvement", { jobTitle: sanitizedJobTitle }, userId, requestId);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            }, {
                maxRetries: 3,
                initialDelayMs: 1000,
                maxDelayMs: 5000,
            });
        });

        let analysis;
        try {
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            analysis = JSON.parse(cleanedText);
            logger.info("Resume improvement analysis completed", { score: analysis.overallScore }, userId, requestId);
        } catch (parseError) {
            logger.warn("Failed to parse improvement analysis, using fallback", { text: text.substring(0, 100) }, userId, requestId);
            analysis = {
                overallScore: 70,
                summary: "Resume analyzed with partial results.",
                sections: {},
                topPriorities: ["Add more quantifiable achievements"],
                missingKeywords: []
            };
        }

        const info = getRateLimitInfo(userId, LIMITS.RATE_LIMIT_AI);
        return NextResponse.json(analysis, {
            headers: {
                'X-RateLimit-Remaining': info.remaining.toString(),
                'X-Request-ID': requestId
            }
        });

    } catch (error: any) {
        logger.apiError('POST', '/api/ai/improve-resume', error, undefined, requestId);

        // Handle circuit breaker
        if (error.message?.includes('Circuit breaker is OPEN')) {
            return NextResponse.json({
                message: "AI service is temporarily unavailable. Please try again in a minute.",
            }, { status: 503 });
        }

        return NextResponse.json({
            message: "Failed to analyze resume",
        }, { status: 500 });
    }
}
