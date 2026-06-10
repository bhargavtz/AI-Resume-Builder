import { NextRequest } from 'next/server';
import { sanitizeForAI, sanitizeJobTitle } from '@/lib/sanitize';
import { LIMITS } from '@/lib/constants';
import { validateData, generateSummarySchema } from '@/lib/validation';
import { executeAIRoute, AIValidationError } from '@/lib/ai/handler';
import { generateAIText } from '@/lib/ai/generate';
import { experienceToText, skillsToText } from '@/lib/ai/parse-input';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
    return executeAIRoute(req, { path: '/api/ai/generate-summary' }, async ({ userId, requestId, body }) => {
        const validation = validateData(generateSummarySchema, body);
        if (!validation.success) {
            throw new AIValidationError(validation.error);
        }

        const { jobTitle, experience, skills } = validation.data;
        const sanitizedJobTitle = sanitizeJobTitle(jobTitle);
        const sanitizedExperience = experienceToText(experience)
            ? sanitizeForAI(experienceToText(experience), LIMITS.MAX_AI_INPUT_LENGTH)
            : '';
        const sanitizedSkills = skillsToText(skills)
            ? sanitizeForAI(skillsToText(skills), LIMITS.MAX_AI_SKILLS_LENGTH)
            : '';

        const prompt = `Generate a professional resume summary for a ${sanitizedJobTitle} with the following details:
${sanitizedExperience ? `Experience: ${sanitizedExperience}` : ''}
${sanitizedSkills ? `Key Skills: ${sanitizedSkills}` : ''}

Requirements:
- Write 2-3 sentences maximum
- Be concise and impactful
- Include relevant keywords for ATS systems
- Highlight key achievements or strengths
- Use active voice and strong action words
- Do not include placeholder text like [Company Name]

Return ONLY the summary text, no quotes or additional formatting.`;

        logger.debug('Calling Gemini API for summary', { jobTitle: sanitizedJobTitle }, userId, requestId);
        const summary = await generateAIText(prompt);
        logger.info('AI summary generated successfully', { length: summary.length }, userId, requestId);

        return { summary };
    });
}
