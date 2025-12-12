import axios, { AxiosError } from "axios";
import {
    GenerateSummaryRequest,
    GenerateBulletsRequest,
    ATSScoreRequest,
    ATSScoreResponse,
    CoverLetterRequest,
    SuggestSkillsRequest,
    SuggestedSkill,
    ImproveResumeRequest,
    ImproveResumeResponse,
    ResumeContent
} from "@/lib/types";

// ============================================
// Retry Helper with Exponential Backoff
// ============================================
const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // Check if it's a rate limit error (429)
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff

                if (attempt < maxRetries - 1) {
                    console.log(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }

            // If it's not a rate limit error, throw immediately
            throw error;
        }
    }

    throw lastError;
};

// ============================================
// AI Summary Generator
// ============================================
export const generateSummary = async (data: GenerateSummaryRequest) => {
    return retryWithBackoff(async () => {
        const response = await axios.post<{ summary: string }>("/api/ai/generate-summary", data);
        return response.data;
    });
};

// ============================================
// AI Bullet Points Generator
// ============================================
export const generateBullets = async (data: GenerateBulletsRequest) => {
    return retryWithBackoff(async () => {
        const response = await axios.post<{ bullets: string[] }>("/api/ai/generate-bullets", data);
        return response.data;
    });
};

// ============================================
// ATS Score Checker
// ============================================
export const checkATSScore = async (data: ATSScoreRequest) => {
    return retryWithBackoff(async () => {
        const response = await axios.post<ATSScoreResponse>("/api/ai/ats-score", data);
        return response.data;
    });
};

// ============================================
// Cover Letter Generator
// ============================================
export const generateCoverLetter = async (data: CoverLetterRequest) => {
    return retryWithBackoff(async () => {
        const response = await axios.post<{ coverLetter: string }>("/api/ai/cover-letter", data);
        return response.data;
    });
};

// ============================================
// Skills Suggester
// ============================================
export const suggestSkills = async (data: SuggestSkillsRequest) => {
    return retryWithBackoff(async () => {
        const response = await axios.post<{ skills: SuggestedSkill[] }>("/api/ai/suggest-skills", data);
        return response.data;
    });
};

// ============================================
// Resume Improver
// ============================================
export const improveResume = async (data: ImproveResumeRequest) => {
    return retryWithBackoff(async () => {
        const response = await axios.post<ImproveResumeResponse>("/api/ai/improve-resume", data);
        return response.data;
    });
};

// ============================================
// Default Export (All Functions)
// ============================================
const AIService = {
    generateSummary,
    generateBullets,
    checkATSScore,
    generateCoverLetter,
    suggestSkills,
    improveResume,
};

export default AIService;
