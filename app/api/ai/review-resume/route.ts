import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, getRateLimitInfo } from "@/lib/rate-limit";
import { sanitizeResumeContent } from "@/lib/sanitize";
import { withRetry, aiCircuitBreaker } from "@/lib/retry";
import { LIMITS } from "@/lib/constants";
import logger from "@/lib/logger";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();
        if (!userId) {
            logger.warn("Unauthorized review resume request", {}, undefined, requestId);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        logger.apiRequest('POST', '/api/ai/review-resume', userId, requestId);

        // Rate limiting
        // Review is expensive, keep limit strict (5/min)
        if (!checkRateLimit(userId, 5, LIMITS.RATE_LIMIT_WINDOW_MS)) {
            const info = getRateLimitInfo(userId, 5);
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

        const { resumeContent } = await req.json();

        if (!resumeContent) {
            return NextResponse.json({ message: "Resume content is required" }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedContent = sanitizeResumeContent(resumeContent);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Conduct a comprehensive review of this resume and provide detailed feedback.

Resume Data:
${JSON.stringify(sanitizedContent, null, 2)}

Provide your analysis in the following JSON format:
{
    "overallScore": 85,
    "overallFeedback": "2-3 sentence summary of the resume's strengths and areas for improvement",
    "sections": {
        "personalDetails": {
            "score": 9,
            "feedback": "Specific feedback",
            "suggestions": ["suggestion 1", "suggestion 2"]
        },
        "summary": {
            "score": 7,
            "feedback": "Specific feedback",
            "suggestions": ["suggestion 1", "suggestion 2"]
        },
        "experience": {
            "score": 8,
            "feedback": "Specific feedback",
            "suggestions": ["suggestion 1", "suggestion 2"]
        },
        "education": {
            "score": 9,
            "feedback": "Specific feedback",
            "suggestions": ["suggestion 1"]
        },
        "skills": {
            "score": 7,
            "feedback": "Specific feedback",
            "suggestions": ["suggestion 1", "suggestion 2"]
        }
    },
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "improvements": ["improvement 1", "improvement 2", "improvement 3"],
    "atsCompatibility": {
        "score": 80,
        "issues": ["issue 1", "issue 2"],
        "recommendations": ["rec 1", "rec 2"]
    },
    "grammarAndSpelling": {
        "score": 9,
        "issues": ["issue 1 if any"]
    },
    "formatting": {
        "score": 8,
        "feedback": "Formatting assessment"
    },
    "topPriorities": ["priority 1", "priority 2", "priority 3"]
}

Focus on:
1. Content quality and relevance
2. Quantifiable achievements
3. Action verbs and power words
4. ATS compatibility
5. Grammar and spelling
6. Formatting consistency
7. Keyword optimization
8. Overall impact and professionalism

Return ONLY valid JSON, no markdown.`;

        // Wrap AI call in retry logic and circuit breaker
        const text = await aiCircuitBreaker.execute(async () => {
            return await withRetry(async () => {
                logger.debug("Calling Gemini API for comprehensive review", {}, userId, requestId);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            }, {
                maxRetries: 3,
                initialDelayMs: 2000, // Longer delay for heavy operation
                maxDelayMs: 10000,
            });
        });

        let review;
        try {
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            review = JSON.parse(cleanedText);
            logger.info("Resume review completed", { score: review.overallScore }, userId, requestId);
        } catch (parseError) {
            logger.warn("Failed to parse review, using fallback", { text: text.substring(0, 100) }, userId, requestId);
            review = {
                overallScore: 75,
                overallFeedback: "Resume reviewed with partial results.",
                sections: {},
                strengths: ["Resume contains relevant content"],
                improvements: ["Consider adding more quantifiable achievements"],
                topPriorities: ["Improve content specificity"],
                rawResponse: text
            };
        }

        const info = getRateLimitInfo(userId, 5);
        return NextResponse.json(review, {
            headers: {
                'X-RateLimit-Remaining': info.remaining.toString(),
                'X-Request-ID': requestId
            }
        });

    } catch (error: any) {
        logger.apiError('POST', '/api/ai/review-resume', error, undefined, requestId);

        // Handle circuit breaker
        if (error.message?.includes('Circuit breaker is OPEN')) {
            return NextResponse.json({
                message: "AI service is temporarily unavailable. Please try again in a minute.",
            }, { status: 503 });
        }

        return NextResponse.json({
            message: "Failed to review resume",
        }, { status: 500 });
    }
}
