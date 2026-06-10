import { NextRequest } from 'next/server';
import { sanitizeForAI, sanitizeJobTitle } from '@/lib/sanitize';
import { LIMITS } from '@/lib/constants';
import { validateData, generateBulletsSchema } from '@/lib/validation';
import { executeAIRoute, AIValidationError } from '@/lib/ai/handler';
import { generateAIObject } from '@/lib/ai/generate';
import { bulletsOutputSchema } from '@/lib/ai/schemas';
import { experienceToText, skillsToText } from '@/lib/ai/parse-input';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
    return executeAIRoute(req, { path: '/api/ai/generate-bullets' }, async ({ userId, requestId, body }) => {
        const validation = validateData(generateBulletsSchema, body);
        if (!validation.success) {
            throw new AIValidationError(validation.error);
        }

        const { jobTitle, experience, skills, context } = validation.data;
        const sanitizedJobTitle = jobTitle ? sanitizeJobTitle(jobTitle) : '';
        const sanitizedExperience = experienceToText(experience)
            ? sanitizeForAI(experienceToText(experience), LIMITS.MAX_AI_INPUT_LENGTH)
            : '';
        const sanitizedSkills = skillsToText(skills)
            ? sanitizeForAI(skillsToText(skills), LIMITS.MAX_AI_SKILLS_LENGTH)
            : '';

        const prompt = `Generate 3-4 professional resume bullet points for a ${sanitizedJobTitle || 'professional'}.

Context: ${context}
${sanitizedExperience ? `Experience Details: ${sanitizedExperience}` : ''}
${sanitizedSkills ? `Relevant Skills: ${sanitizedSkills}` : ''}

Requirements:
- Start each bullet with a strong action verb
- Include quantifiable achievements where possible (use realistic numbers)
- Be specific and results-oriented
- Keep each bullet to 1-2 lines maximum
- Make them ATS-friendly with relevant keywords
- Do not use generic phrases or placeholders`;

        logger.debug('Calling Gemini API for bullets', { context }, userId, requestId);
        const result = await generateAIObject(bulletsOutputSchema, prompt);
        logger.info('AI bullets generated successfully', { count: result.bullets.length }, userId, requestId);

        return { bullets: result.bullets };
    });
}
