"use client";
import { createContext, useContext } from "react";
import { ResumeContent } from "@/lib/types";

export interface ResumeInfoContextType {
    resumeInfo: ResumeContent | null;
    setResumeInfo: React.Dispatch<React.SetStateAction<ResumeContent | null>>;
}

export const ResumeInfoContext = createContext<ResumeInfoContextType>({
    resumeInfo: null,
    setResumeInfo: () => { },
});

// Custom hook for easier usage with type safety
export function useResumeInfo() {
    const context = useContext(ResumeInfoContext);
    if (!context) {
        throw new Error("useResumeInfo must be used within a ResumeInfoProvider");
    }
    return context;
}
