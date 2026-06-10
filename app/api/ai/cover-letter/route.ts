import { NextRequest } from 'next/server';
import { sanitizeResumeContent, sanitizeJobTitle, sanitizeForAI } from '@/lib/sanitize';
import { LIMITS } from '@/lib/constants';
import { validateData, coverLetterSchema } from '@/lib/validation';
import { executeAIRoute, AIValidationError } from '@/lib/ai/handler';
import { generateAIText } from '@/lib/ai/generate';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
    return executeAIRoute(req, { path: '/api/ai/cover-letter' }, async ({ userId, requestId, body }) => {
        const validation = validateData(coverLetterSchema, body);
        if (!validation.success) {
            throw new AIValidationError(validation.error);
        }

        const { resumeContent, jobTitle, companyName, jobDescription } = validation.data;
        const sanitizedContent = sanitizeResumeContent(resumeContent || {});
        const sanitizedJobTitle = sanitizeJobTitle(jobTitle);
        const sanitizedCompany = sanitizeJobTitle(companyName);
        const sanitizedJobDesc = jobDescription
            ? sanitizeForAI(jobDescription, LIMITS.MAX_SUMMARY_LENGTH)
            : '';

        const personalInfo = sanitizedContent?.personalDetails || {};
        const experience = (sanitizedContent?.experience || []) as Array<{ title?: string; companyName?: string }>;
        const skills = (sanitizedContent?.skills || []) as Array<{ name?: string }>;

        const prompt = `Generate a professional cover letter for the following:

Applicant Name: ${personalInfo.firstName || ''} ${personalInfo.lastName || ''}
Current/Target Job Title: ${personalInfo.jobTitle || jobTitle}
Email: ${personalInfo.email || ''}
Phone: ${personalInfo.phone || ''}

Applying for: ${sanitizedJobTitle} at ${sanitizedCompany}

${sanitizedJobDesc ? `Job Description:\n${sanitizedJobDesc}` : ''}

Experience Summary:
${experience.map((exp) => `- ${exp.title} at ${exp.companyName || 'Unknown'}`).join('\n') || 'Not provided'}

Key Skills:
${skills.map((skill) => skill.name).join(', ') || 'Not provided'}

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

        logger.debug('Calling Gemini API for cover letter', { jobTitle: sanitizedJobTitle, company: sanitizedCompany }, userId, requestId);
        const coverLetter = await generateAIText(prompt);
        logger.info('Cover letter generated successfully', { length: coverLetter.length }, userId, requestId);

        return { coverLetter };
    });
}
