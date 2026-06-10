import { NextRequest } from 'next/server';
import { sanitizeResumeContent, sanitizeForAI } from '@/lib/sanitize';
import { LIMITS } from '@/lib/constants';
import { validateData, atsScoreSchema } from '@/lib/validation';
import { executeAIRoute, AIValidationError } from '@/lib/ai/handler';
import { generateAIObject } from '@/lib/ai/generate';
import { atsScoreOutputSchema } from '@/lib/ai/schemas';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
    return executeAIRoute(req, { path: '/api/ai/ats-score' }, async ({ userId, requestId, body }) => {
        const validation = validateData(atsScoreSchema, body);
        if (!validation.success) {
            throw new AIValidationError(validation.error);
        }

        const { resumeContent, jobDescription } = validation.data;
        const sanitizedContent = sanitizeResumeContent(resumeContent);
        const sanitizedJobDesc = jobDescription
            ? sanitizeForAI(jobDescription, LIMITS.MAX_SUMMARY_LENGTH)
            : '';

        const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a score and recommendations.

Resume Content:
${JSON.stringify(sanitizedContent)}

${sanitizedJobDesc ? `Target Job Description:\n${sanitizedJobDesc}` : ''}

Consider these factors:
1. Clear section headings
2. Proper formatting (no tables, columns, or graphics)
3. Relevant keywords matching job description
4. Action verbs and quantifiable achievements
5. Contact information completeness
6. Skills alignment with job requirements`;

        logger.debug('Calling Gemini API for ATS analysis', {}, userId, requestId);
        const analysis = await generateAIObject(atsScoreOutputSchema, prompt);
        logger.info('ATS analysis completed successfully', { score: analysis.score }, userId, requestId);

        return analysis;
    });
}
