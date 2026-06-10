import { describe, expect, it } from 'vitest';
import {
    createResumeSchema,
    suggestSkillsSchema,
    validateData,
    generateSummarySchema,
} from '@/lib/validation';

describe('validation', () => {
    it('validates create resume input', () => {
        const result = validateData(createResumeSchema, { title: 'Software Engineer Resume' });
        expect(result.success).toBe(true);
    });

    it('rejects empty resume title', () => {
        const result = validateData(createResumeSchema, { title: '' });
        expect(result.success).toBe(false);
    });

    it('accepts currentSkills for suggest skills', () => {
        const result = validateData(suggestSkillsSchema, {
            jobTitle: 'Frontend Developer',
            currentSkills: ['React', 'TypeScript'],
        });
        expect(result.success).toBe(true);
    });

    it('accepts array experience in summary schema', () => {
        const result = validateData(generateSummarySchema, {
            jobTitle: 'Engineer',
            experience: [{ title: 'Developer', companyName: 'Acme' }],
            skills: [{ name: 'React' }],
        });
        expect(result.success).toBe(true);
    });
});
