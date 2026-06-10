import { z } from 'zod';

export const bulletsOutputSchema = z.object({
    bullets: z.array(z.string()),
});

export const atsScoreOutputSchema = z.object({
    score: z.number().min(0).max(100),
    summary: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    keywords: z.object({
        found: z.array(z.string()),
        missing: z.array(z.string()),
    }),
});

export const suggestSkillsOutputSchema = z.object({
    skills: z.array(z.object({
        name: z.string(),
        category: z.string().optional(),
        importance: z.enum(['High', 'Medium', 'Low']).optional(),
    })),
});

const sectionImprovementSchema = z.object({
    score: z.number(),
    suggestions: z.array(z.string()),
});

export const improveResumeOutputSchema = z.object({
    overallScore: z.number().min(0).max(100),
    summary: z.string(),
    sections: z.record(z.string(), sectionImprovementSchema),
    topPriorities: z.array(z.string()),
    missingKeywords: z.array(z.string()).optional(),
});

const reviewSectionSchema = z.object({
    score: z.number(),
    feedback: z.string().optional(),
    suggestions: z.array(z.string()),
});

export const reviewResumeOutputSchema = z.object({
    overallScore: z.number().min(0).max(100),
    overallFeedback: z.string(),
    sections: z.record(z.string(), reviewSectionSchema),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    atsCompatibility: z.object({
        score: z.number(),
        issues: z.array(z.string()),
        recommendations: z.array(z.string()),
    }).optional(),
    grammarAndSpelling: z.object({
        score: z.number(),
        issues: z.array(z.string()),
    }).optional(),
    formatting: z.object({
        score: z.number(),
        feedback: z.string(),
    }).optional(),
    topPriorities: z.array(z.string()),
});
