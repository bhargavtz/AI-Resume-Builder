"use client"
import React, { useEffect, useState, use, useRef } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import FormSection from '@/components/resume/FormSection'
import ResumePreview from '@/components/resume/ResumePreview'
import ErrorBoundary from '@/components/ErrorBoundary'
import axios from 'axios'
import { toast } from 'sonner'
import { ResumeContent } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function EditResume({ params }: { params: Promise<{ resumeId: string }> }) {
    const { resumeId } = use(params);
    const [resumeInfo, setResumeInfo] = useState<ResumeContent | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        GetResumeInfo();
    }, [resumeId])

    const GetResumeInfo = async () => {
        try {
            const result = await axios.get('/api/resumes/' + resumeId);
            // Use the content from database, or initialize with empty object for new resumes
            setResumeInfo(result.data.content || {});
            isInitialLoad.current = true;
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error fetching resume:', e);
            }
            // Initialize with empty object on error
            setResumeInfo({});
            toast.error('Failed to load resume');
        }
    }

    // Auto-save resume content to database when it changes
    useEffect(() => {
        // Skip auto-save on initial load or if resumeId is not available
        if (!resumeInfo || !resumeId) {
            return;
        }

        // Skip the first change after loading (initial data population)
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        const currentResumeId = resumeId;
        const autoSaveTimer = setTimeout(async () => {
            if (!currentResumeId) return;

            setIsSaving(true);
            try {
                // Sanitize data before sending to prevent validation errors
                const sanitizedData = sanitizeResumeData(resumeInfo);

                await axios.put('/api/resumes/' + currentResumeId, {
                    content: sanitizedData
                });
                setLastSaved(new Date());
                // Silent save - no toast to avoid interrupting the user
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Auto-save failed:', error);
                    if (axios.isAxiosError(error) && error.response) {
                        console.error('Response data:', error.response.data);
                        console.error('Resume data:', JSON.stringify(resumeInfo, null, 2));
                    }
                }

                // Provide helpful error message based on error type
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                    toast.error('Some data couldn\'t be saved. Please review your entries.');
                } else {
                    toast.error('Failed to auto-save. Please save manually.');
                }
            } finally {
                setIsSaving(false);
            }
        }, 2000); // Debounce: save 2 seconds after last change (improved from 1s)

        return () => clearTimeout(autoSaveTimer);
    }, [resumeInfo, resumeId])

    // Sanitize resume data to ensure it matches validation schema
    const sanitizeResumeData = (data: ResumeContent): ResumeContent => {
        return {
            ...data,
            // Normalize skills to ensure consistent format
            skills: data.skills?.map(skill => {
                // Handle string format (legacy)
                if (typeof skill === 'string') {
                    return {
                        id: Date.now().toString() + Math.random(),
                        name: skill,
                        rating: 80
                    };
                }

                // Handle object format - ensure all required fields
                return {
                    id: skill.id || Date.now().toString() + Math.random(),
                    name: typeof skill.name === 'string' ? skill.name : String(skill.name || ''),
                    rating: typeof skill.rating === 'number' ?
                        Math.min(100, Math.max(0, skill.rating)) : 80 // Clamp to 0-100
                };
            }).filter(s => s.name && s.name.trim()) || [], // Remove empty skills

            // Ensure arrays exist
            experience: data.experience || [],
            education: data.education || [],

            // Ensure theme color is valid
            themeColor: data.themeColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(data.themeColor)
                ? data.themeColor
                : undefined
        };
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <ErrorBoundary>
                {/* Floating Dashboard Button */}
                <Link
                    href="/dashboard"
                    className='fixed top-4 left-4 z-50 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border text-foreground font-medium hover:bg-background transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group'
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Dashboard
                </Link>

                <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10 relative'>
                    {/* Enhanced saving indicator with timestamp */}
                    <div className='fixed top-20 right-4 z-50'>
                        {isSaving ? (
                            <div className='px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm flex items-center gap-2 animate-pulse'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full animate-ping' />
                                Saving...
                            </div>
                        ) : lastSaved ? (
                            <div className='px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm flex items-center gap-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full' />
                                Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                            </div>
                        ) : null}
                    </div>

                    <FormSection resumeId={resumeId} />
                    <div className='sticky top-10 h-fit'>
                        <ResumePreview />
                    </div>
                </div>
            </ErrorBoundary>
        </ResumeInfoContext.Provider>
    )
}
