/**
 * Zod validation schemas for API input validation
 * Ensures data integrity and security
 */

import { z } from 'zod';

// ============================================
// Personal Details Schema
// ============================================
export const personalDetailsSchema = z.object({
    firstName: z.string().max(50, 'First name too long').optional(),
    lastName: z.string().max(50, 'Last name too long').optional(),
    jobTitle: z.string().max(100, 'Job title too long').optional(),
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    phone: z.string().max(20, 'Phone number too long').optional(),
    address: z.string().max(200, 'Address too long').optional(),
    city: z.string().max(50, 'City name too long').optional(),
    state: z.string().max(50, 'State name too long').optional(),
    zipCode: z.string().max(20, 'Zip code too long').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
}).passthrough();

// ============================================
// Experience Schema
// ============================================
export const experienceEntrySchema = z.object({
    id: z.string(),
    title: z.string().max(100, 'Title too long'),
    companyName: z.string().max(100, 'Company name too long'),
    city: z.string().max(50).optional(),
    state: z.string().max(50).optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    currentlyWorking: z.boolean(),
    workSummary: z.preprocess(
        (val) => {
            // Convert array to HTML string if needed (for backward compatibility)
            if (Array.isArray(val)) {
                return `<ul>${val.map(item => `<li>${item}</li>`).join('')}</ul>`;
            }
            return val;
        },
        z.string().max(5000, 'Work summary too long').optional()
    ),
}).passthrough();

// ============================================
// Education Schema
// ============================================
export const educationEntrySchema = z.object({
    id: z.string(),
    universityName: z.string().max(150, 'University name too long'),
    degree: z.string().max(100, 'Degree too long'),
    major: z.string().max(100, 'Major too long').optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().max(3000, 'Description too long').optional(),
}).passthrough();

// ============================================
// Skills Schema
// ============================================
export const skillEntrySchema = z.object({
    id: z.string(),
    name: z.string().max(50, 'Skill name too long'),
    rating: z.number().min(0).max(100).optional(), // Percentage-based rating (0-100)
}).passthrough();

// ============================================
// Resume Content Schema
// ============================================
export const resumeContentSchema = z.object({
    personalDetails: personalDetailsSchema.optional(),
    summary: z.string().max(5000, 'Summary too long').optional(),
    experience: z.array(experienceEntrySchema).max(20, 'Too many experience entries').optional(),
    education: z.array(educationEntrySchema).max(10, 'Too many education entries').optional(),
    skills: z.array(skillEntrySchema).max(50, 'Too many skills').optional(),
    themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
    sectionOrder: z.array(z.string()).max(10).optional(),
}).passthrough();

// ============================================
// API Request Schemas
// ============================================
export const createResumeSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
});

export const updateResumeSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim()
        .optional(),
    content: resumeContentSchema.optional(),
    themeColor: z.string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')
        .optional(),
    status: z.enum(['draft', 'complete', 'archived']).optional(),
});

// ============================================
// AI Request Schemas
// ============================================
export const generateSummarySchema = z.object({
    jobTitle: z.string().min(1, 'Job title is required').max(100),
    experience: z.string().max(2000).optional(),
    skills: z.string().max(500).optional(),
});

export const generateBulletsSchema = z.object({
    jobTitle: z.string().max(100).optional(),
    context: z.enum(['experience', 'project']),
    companyName: z.string().max(100).optional(),
    experience: z.string().max(2000).optional(),
    skills: z.string().max(500).optional(),
});

export const atsScoreSchema = z.object({
    resumeContent: resumeContentSchema,
    jobDescription: z.string().max(5000).optional(),
});

export const coverLetterSchema = z.object({
    resumeContent: resumeContentSchema,
    jobTitle: z.string().min(1, 'Job title is required').max(100),
    companyName: z.string().min(1, 'Company name is required').max(100),
    jobDescription: z.string().max(5000).optional(),
});

export const suggestSkillsSchema = z.object({
    jobTitle: z.string().min(1, 'Job title is required').max(100),
    industry: z.string().max(100).optional(),
    currentSkills: z.array(z.string().max(50)).max(50).optional(),
});

export const improveResumeSchema = z.object({
    resumeContent: resumeContentSchema,
    targetJobTitle: z.string().max(100).optional(),
});

// ============================================
// Validation Helper Function
// ============================================
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true; data: T
} | {
    success: false; error: string
} {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const errorMessage = result.error.issues
        .map((e) => `${String(e.path.join('.'))}: ${e.message}`)
        .join(', ');
    return { success: false, error: errorMessage };
}

// Type exports
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type ResumeContentInput = z.infer<typeof resumeContentSchema>;
