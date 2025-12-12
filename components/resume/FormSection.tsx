"use client"
import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import Summary from './forms/Summary'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import ThemeColor from './ThemeColor'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Download, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

const formSections = [
    { id: 1, title: 'Personal Details', icon: '👤' },
    { id: 2, title: 'Summary', icon: '📝' },
    { id: 3, title: 'Experience', icon: '💼' },
    { id: 4, title: 'Education', icon: '🎓' },
    { id: 5, title: 'Skills', icon: '⚡' },
]

interface FormSectionProps {
    resumeId?: string;
}

function FormSection({ resumeId }: FormSectionProps) {
    const router = useRouter();
    const [activeFormIndex, setActiveFormIndex] = useState(1);
    const [enableNext, setEnableNext] = useState(false);

    const handleNext = () => {
        if (activeFormIndex < formSections.length) {
            setActiveFormIndex(activeFormIndex + 1)
            setEnableNext(false)
        }
    }

    const handlePrevious = () => {
        if (activeFormIndex > 1) {
            setActiveFormIndex(activeFormIndex - 1)
            setEnableNext(true)
        }
    }

    const handleDownload = () => {
        if (resumeId) {
            router.push(`/dashboard/resume/${resumeId}/view`);
        }
    }

    const handlePreview = () => {
        if (resumeId) {
            router.push(`/dashboard/resume/${resumeId}/view`);
        }
    }

    return (
        <div>
            {/* Header with Navigation */}
            <div className='flex justify-between items-center'>
                <div className='flex gap-2'>
                    {activeFormIndex > 1 && (
                        <Button size="sm" variant="outline" onClick={handlePrevious}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <div className='flex gap-2'>
                    {/* Theme Color Button */}
                    <ThemeColor />

                    {/* Preview Button - always visible */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePreview}
                        className='flex gap-2'
                    >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </Button>

                    {activeFormIndex < formSections.length ? (
                        <Button
                            disabled={!enableNext}
                            className='flex gap-2'
                            size="sm"
                            onClick={handleNext}
                        >
                            Next <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            className='flex gap-2'
                            size="sm"
                            variant="default"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download PDF</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Step Indicator */}
            <div className='flex justify-center gap-2 mt-4 mb-2'>
                {formSections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => {
                            // Allow navigation to any section (not just previous ones)
                            setActiveFormIndex(section.id)
                            setEnableNext(true)
                        }}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${activeFormIndex === section.id
                            ? 'bg-primary text-primary-foreground'
                            : section.id < activeFormIndex
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        <span>{section.icon}</span>
                        <span className='hidden sm:inline'>{section.title}</span>
                    </button>
                ))}
            </div>

            {/* Form Sections */}
            {activeFormIndex === 1 && (
                <PersonalDetail enabledNext={(v: boolean) => setEnableNext(v)} />
            )}

            {activeFormIndex === 2 && (
                <Summary enabledNext={(v: boolean) => setEnableNext(v)} />
            )}

            {activeFormIndex === 3 && (
                <Experience enabledNext={(v: boolean) => setEnableNext(v)} />
            )}

            {activeFormIndex === 4 && (
                <Education enabledNext={(v: boolean) => setEnableNext(v)} />
            )}

            {activeFormIndex === 5 && (
                <Skills enabledNext={(v: boolean) => setEnableNext(v)} />
            )}
        </div>
    )
}

export default FormSection
