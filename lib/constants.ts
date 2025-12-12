/**
 * Application Constants
 * Centralized configuration values to avoid magic numbers
 */

export const LIMITS = {
    // Pagination
    RESUMES_PER_PAGE: 12,
    MAX_RESUMES_FETCH: 50,

    // Rate Limiting
    RATE_LIMIT_AI: 10,
    RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
    RATE_LIMIT_SHARE: 20,

    // Cache
    CACHE_TTL_SECONDS: 300, // 5 minutes
    CACHE_CLEANUP_INTERVAL_MS: 300000, // 5 minutes

    // Content Lengths
    MAX_TITLE_LENGTH: 100,
    MAX_SUMMARY_LENGTH: 5000,
    MAX_WORK_SUMMARY_LENGTH: 5000,
    MAX_DESCRIPTION_LENGTH: 3000,
    MAX_SKILL_NAME_LENGTH: 50,
    MAX_EXPERIENCE_ENTRIES: 20,
    MAX_EDUCATION_ENTRIES: 10,
    MAX_SKILLS: 50,

    // AI Input Limits
    MAX_AI_INPUT_LENGTH: 2000,
    MAX_AI_SKILLS_LENGTH: 500,
    MAX_JOB_TITLE_LENGTH: 100,

    // Share Token
    SHARE_TOKEN_LENGTH: 32,
    SHARE_TOKEN_EXPIRY_DAYS: 7,

    // API Timeouts
    API_TIMEOUT_MS: 30000, // 30 seconds
    AI_TIMEOUT_MS: 60000, // 60 seconds
} as const;

export const TEMPLATES = {
    VALID_IDS: ['modern', 'classic', 'minimal', 'creative'] as const,
    DEFAULT: 'modern',
} as const;

export const RESUME_STATUS = {
    DRAFT: 'draft',
    COMPLETE: 'complete',
    ARCHIVED: 'archived',
} as const;

export const DEFAULT_THEME_COLOR = '#3b82f6';

export const SECTION_ORDER = {
    DEFAULT: ['summary', 'experience', 'education', 'skills'] as const,
} as const;

export type ValidTemplate = typeof TEMPLATES.VALID_IDS[number];
export type ResumeStatus = typeof RESUME_STATUS[keyof typeof RESUME_STATUS];
