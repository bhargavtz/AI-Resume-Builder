import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, getRateLimitInfo } from "@/lib/rate-limit";
import { sanitizeResumeContent, sanitizeJobTitle, sanitizeForAI } from "@/lib/sanitize";
import { withRetry, aiCircuitBreaker } from "@/lib/retry";
import { LIMITS } from "@/lib/constants";
import logger from "@/lib/logger";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();
        if (!userId) {
            logger.warn("Unauthorized cover letter request", {}, undefined, requestId);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        logger.apiRequest('POST', '/api/ai/cover-letter', userId, requestId);

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

        const { resumeContent, jobTitle, companyName, jobDescription } = await req.json();

        if (!jobTitle || !companyName) {
            return NextResponse.json({
                message: "Job title and company name are required"
            }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedContent = sanitizeResumeContent(resumeContent || {});
        const sanitizedJobTitle = sanitizeJobTitle(jobTitle);
        const sanitizedCompany = sanitizeJobTitle(companyName);
        const sanitizedJobDesc = jobDescription ? sanitizeForAI(jobDescription, LIMITS.MAX_SUMMARY_LENGTH) : '';

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const personalInfo = sanitizedContent?.personalDetails || {};
        const experience = sanitizedContent?.experience || [];
        const skills = sanitizedContent?.skills || [];

        const prompt = `Generate a professional cover letter for the following:

Applicant Name: ${personalInfo.firstName || ''} ${personalInfo.lastName || ''}
Current/Target Job Title: ${personalInfo.jobTitle || jobTitle}
Email: ${personalInfo.email || ''}
Phone: ${personalInfo.phone || ''}

Applying for: ${sanitizedJobTitle} at ${sanitizedCompany}

${sanitizedJobDesc ? `Job Description:\n${sanitizedJobDesc}` : ''}

Experience Summary:
${experience.map((exp: any) => `- ${exp.title} at ${exp.company}`).join('\n') || 'Not provided'}

Key Skills:
${skills.map((skill: any) => skill.name).join(', ') || 'Not provided'}

Requirements:
- Write a compelling, personalized cover letter
- 3-4 paragraphs maximum
- Professional but engaging tone
- Highlight relevant experience and skills
- Show enthusiasm for the role and company
- Include a strong opening and closing
- Do NOT include placeholder text like [Your Name] - use actual details provided
- Format: Plain text with proper paragraph breaks

Return ONLY the cover letter text, no additional formatting or instructions.`;

        // Wrap AI call in retry logic and circuit breaker
        const coverLetter = await aiCircuitBreaker.execute(async () => {
            return await withRetry(async () => {
                logger.debug("Calling Gemini API for cover letter", { jobTitle: sanitizedJobTitle, company: sanitizedCompany }, userId, requestId);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            }, {
                maxRetries: 3,
                initialDelayMs: 1000,
                maxDelayMs: 5000,
            });
        });

        logger.info("Cover letter generated successfully", { length: coverLetter.length }, userId, requestId);

        const info = getRateLimitInfo(userId, LIMITS.RATE_LIMIT_AI);
        return NextResponse.json({ coverLetter }, {
            headers: {
                'X-RateLimit-Remaining': info.remaining.toString(),
                'X-Request-ID': requestId
            }
        });

    } catch (error: any) {
        logger.apiError('POST', '/api/ai/cover-letter', error, undefined, requestId);

        //Handle circuit breaker
        if (error.message?.includes('Circuit breaker is OPEN')) {
            return NextResponse.json({
                message: "AI service is temporarily unavailable. Please try again in a minute.",
            }, { status: 503 });
        }

        return NextResponse.json({
            message: "Failed to generate cover letter",
        }, { status: 500 });
    }
}
