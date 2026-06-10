import { NextRequest } from 'next/server';
import { sanitizeForAI, sanitizeJobTitle, sanitizeArray } from '@/lib/sanitize';
import { validateData, suggestSkillsSchema } from '@/lib/validation';
import { executeAIRoute, AIValidationError } from '@/lib/ai/handler';
import { generateAIObject } from '@/lib/ai/generate';
import { suggestSkillsOutputSchema } from '@/lib/ai/schemas';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
    return executeAIRoute(req, { path: '/api/ai/suggest-skills' }, async ({ userId, requestId, body }) => {
        const validation = validateData(suggestSkillsSchema, body);
        if (!validation.success) {
            throw new AIValidationError(validation.error);
        }

        const { jobTitle, industry, currentSkills } = validation.data;
        const sanitizedJobTitle = sanitizeJobTitle(jobTitle);
        const sanitizedIndustry = industry ? sanitizeForAI(industry, 100) : '';
        const sanitizedSkills = currentSkills ? sanitizeArray(currentSkills) : [];

        const prompt = `Suggest relevant skills for a ${sanitizedJobTitle} position${sanitizedIndustry ? ` in the ${sanitizedIndustry} industry` : ''}.

${sanitizedSkills.length ? `Already listed skills: ${sanitizedSkills.join(', ')}` : ''}

Requirements:
- Suggest 10 skills that would be valuable for this role
- Include a mix of technical and soft skills
- Order by relevance (most important first)
- Do NOT repeat skills already listed
- Focus on in-demand, ATS-friendly keywords`;

        logger.debug('Calling Gemini API for skill suggestions', { jobTitle: sanitizedJobTitle }, userId, requestId);
        const result = await generateAIObject(suggestSkillsOutputSchema, prompt);
        logger.info('AI skills suggested successfully', { count: result.skills.length }, userId, requestId);

        return { skills: result.skills };
    });
}
