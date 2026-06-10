import { NextRequest } from 'next/server';
import { sanitizeResumeContent, sanitizeJobTitle } from '@/lib/sanitize';
import { validateData, improveResumeSchema } from '@/lib/validation';
import { executeAIRoute, AIValidationError } from '@/lib/ai/handler';
import { generateAIObject } from '@/lib/ai/generate';
import { improveResumeOutputSchema } from '@/lib/ai/schemas';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
    return executeAIRoute(req, { path: '/api/ai/improve-resume' }, async ({ userId, requestId, body }) => {
        const validation = validateData(improveResumeSchema, body);
        if (!validation.success) {
            throw new AIValidationError(validation.error);
        }

        const { resumeContent, targetJobTitle } = validation.data;
        const sanitizedContent = sanitizeResumeContent(resumeContent);
        const sanitizedJobTitle = targetJobTitle ? sanitizeJobTitle(targetJobTitle) : '';

        const prompt = `Review this resume and provide specific, actionable improvement suggestions.

Resume Data:
${JSON.stringify(sanitizedContent, null, 2)}

${sanitizedJobTitle ? `Target Role: ${sanitizedJobTitle}` : ''}

Focus on:
1. Quantifiable achievements (numbers, percentages)
2. Action verbs usage
3. Keyword optimization for ATS
4. Content relevance to target role
5. Professional formatting`;

        logger.debug('Calling Gemini API for resume improvement', { jobTitle: sanitizedJobTitle }, userId, requestId);
        const analysis = await generateAIObject(improveResumeOutputSchema, prompt);
        logger.info('Resume improvement analysis completed', { score: analysis.overallScore }, userId, requestId);

        return analysis;
    });
}
