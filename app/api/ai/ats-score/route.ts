import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, getRateLimitInfo } from "@/lib/rate-limit";
import { sanitizeResumeContent, sanitizeForAI } from "@/lib/sanitize";
import { withRetry, aiCircuitBreaker } from "@/lib/retry";
import { LIMITS } from "@/lib/constants";
import logger from "@/lib/logger";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();
        if (!userId) {
            logger.warn("Unauthorized ATS score request", {}, undefined, requestId);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        logger.apiRequest('POST', '/api/ai/ats-score', userId, requestId);

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

        const { resumeContent, jobDescription } = await req.json();

        if (!resumeContent) {
            return NextResponse.json({ message: "Resume content is required" }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedContent = sanitizeResumeContent(resumeContent);
        const sanitizedJobDesc = jobDescription ? sanitizeForAI(jobDescription, LIMITS.MAX_SUMMARY_LENGTH) : '';

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a score and recommendations.

Resume Content:
${JSON.stringify(sanitizedContent)}

${sanitizedJobDesc ? `Target Job Description:\n${sanitizedJobDesc}` : ""}

Provide your analysis in the following JSON format (return ONLY valid JSON, no markdown):
{
    "score": 75,
    "summary": "one sentence summary of ATS compatibility",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "improvements": ["improvement 1", "improvement 2", "improvement 3"],
    "keywords": {
        "found": ["keyword 1", "keyword 2"],
        "missing": ["keyword 1", "keyword 2"]
    }
}

Consider these factors:
1. Clear section headings
2. Proper formatting (no tables, columns, or graphics)
3. Relevant keywords matching job description
4. Action verbs and quantifiable achievements
5. Contact information completeness
6. Skills alignment with job requirements`;

        // Wrap AI call in retry logic and circuit breaker
        const text = await aiCircuitBreaker.execute(async () => {
            return await withRetry(async () => {
                logger.debug("Calling Gemini API for ATS analysis", {}, userId, requestId);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            }, {
                maxRetries: 3,
                initialDelayMs: 1000,
                maxDelayMs: 5000,
            });
        });

        // Parse JSON from response
        let analysis;
        try {
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            analysis = JSON.parse(cleanedText);
            logger.info("ATS analysis completed successfully", { score: analysis.score }, userId, requestId);
        } catch (parseError) {
            logger.warn("Failed to parse ATS analysis, using fallback", { text: text.substring(0, 100) }, userId, requestId);
            analysis = {
                score: 70,
                summary: "Analysis completed with partial results",
                strengths: ["Resume contains relevant content"],
                improvements: ["Consider adding more keywords"],
                keywords: { found: [], missing: [] },
                rawResponse: text
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
        logger.apiError('POST', '/api/ai/ats-score', error, undefined, requestId);

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
