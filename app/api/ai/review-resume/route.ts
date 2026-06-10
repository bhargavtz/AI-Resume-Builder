import { NextRequest } from 'next/server';
import { sanitizeResumeContent } from '@/lib/sanitize';
import { AI } from '@/lib/constants';
import { validateData, reviewResumeSchema } from '@/lib/validation';
import { executeAIRoute, AIValidationError } from '@/lib/ai/handler';
import { generateAIObject } from '@/lib/ai/generate';
import { reviewResumeOutputSchema } from '@/lib/ai/schemas';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
    return executeAIRoute(
        req,
        { path: '/api/ai/review-resume', rateLimit: AI.REVIEW_RATE_LIMIT },
        async ({ userId, requestId, body }) => {
            const validation = validateData(reviewResumeSchema, body);
            if (!validation.success) {
                throw new AIValidationError(validation.error);
            }

            const { resumeContent } = validation.data;
            const sanitizedContent = sanitizeResumeContent(resumeContent);

            const prompt = `Conduct a comprehensive review of this resume and provide detailed feedback.

Resume Data:
${JSON.stringify(sanitizedContent, null, 2)}

Focus on:
1. Content quality and relevance
2. Quantifiable achievements
3. Action verbs and power words
4. ATS compatibility
5. Grammar and spelling
6. Formatting consistency
7. Keyword optimization
8. Overall impact and professionalism`;

            logger.debug('Calling Gemini API for comprehensive review', {}, userId, requestId);
            const review = await generateAIObject(reviewResumeOutputSchema, prompt, {
                maxRetries: 3,
                initialDelayMs: 2000,
                maxDelayMs: 10000,
            });
            logger.info('Resume review completed', { score: review.overallScore }, userId, requestId);

            return review;
        }
    );
}
