/**
 * TypeScript interfaces for AI Resume Builder
 * Provides type safety throughout the application
 */

// ============================================
// Personal Details
// ============================================
export interface PersonalDetails {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    linkedin?: string;
    website?: string;
}

// ============================================
// Experience
// ============================================
export interface ExperienceEntry {
    id: string;
    title?: string;
    companyName?: string;
    city?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    workSummary?: string;
}

// ============================================
// Education
// ============================================
export interface EducationEntry {
    id: string;
    universityName?: string;
    degree?: string;
    major?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

// ============================================
// Skills
// ============================================
export interface SkillEntry {
    id: string;
    name?: string;
    rating?: number; // 1-5 scale
}

// ============================================
// Resume Content (All Sections)
// ============================================
export interface ResumeContent {
    personalDetails?: PersonalDetails;
    summary?: string;
    experience?: ExperienceEntry[];
    education?: EducationEntry[];
    skills?: SkillEntry[];
    themeColor?: string;
    sectionOrder?: string[]; // Custom section order: ['summary', 'experience', 'education', 'skills']
}

// ============================================
// Full Resume Document
// ============================================
export interface Resume {
    _id: string;
    title: string;
    userId: string;
    userEmail?: string;
    userName?: string;
    content: ResumeContent;
    themeColor: string;
    status: 'draft' | 'complete' | 'archived';
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// Resume Context Type
// ============================================
export interface ResumeContextType {
    resumeInfo: ResumeContent | null;
    setResumeInfo: React.Dispatch<React.SetStateAction<ResumeContent | null>>;
}

// ============================================
// API Request/Response Types
// ============================================
export interface CreateResumeRequest {
    title: string;
}

export interface UpdateResumeRequest {
    title?: string;
    content?: ResumeContent;
    themeColor?: string;
    status?: 'draft' | 'complete' | 'archived';
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// ============================================
// AI Service Types
// ============================================
export interface GenerateSummaryRequest {
    jobTitle: string;
    experience?: string;
    skills?: string;
}

export interface GenerateBulletsRequest {
    jobTitle?: string;
    context: 'experience' | 'project';
    companyName?: string;
    experience?: string;
    skills?: string;
}

export interface ATSScoreRequest {
    resumeContent: ResumeContent;
    jobDescription?: string;
}

export interface ATSScoreResponse {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    keywords: {
        found: string[];
        missing: string[];
    };
    rawResponse?: string;
}

export interface CoverLetterRequest {
    resumeContent: ResumeContent;
    jobTitle: string;
    companyName: string;
    jobDescription?: string;
}

export interface SuggestSkillsRequest {
    jobTitle: string;
    industry?: string;
    currentSkills?: string[];
}

export interface SuggestedSkill {
    name: string;
    importance: 'High' | 'Medium' | 'Low';
    category?: string;
}

export interface ImproveResumeRequest {
    resumeContent: ResumeContent;
    targetJobTitle?: string;
}

export interface SectionImprovement {
    score: number;
    suggestions: string[];
}

export interface ImproveResumeResponse {
    overallScore: number;
    summary: string;
    sections: Record<string, SectionImprovement>;
    topPriorities: string[];
    missingKeywords?: string[];
}

export interface ReviewResumeResponse {
    overallScore: number;
    overallFeedback: string;
    sections: Record<string, SectionImprovement & { feedback?: string }>;
    strengths: string[];
    improvements: string[];
    atsCompatibility?: {
        score: number;
        issues: string[];
        recommendations: string[];
    };
    grammarAndSpelling?: {
        score: number;
        issues: string[];
    };
    formatting?: {
        score: number;
        feedback: string;
    };
    topPriorities: string[];
}
