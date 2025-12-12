"use client"
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'

function ExperiencePreview() {
    const { resumeInfo } = useContext(ResumeInfoContext)

    if (!resumeInfo?.experience || resumeInfo.experience.length === 0) return null

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }

    return (
        <div className='my-6'>
            <h2
                className='text-center font-bold text-sm mb-2'
                style={{ color: resumeInfo?.themeColor }}
            >
                PROFESSIONAL EXPERIENCE
            </h2>

            {resumeInfo.experience.map((exp: any, index: number) => (
                <div key={exp.id || index} className='mb-4'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <h3 className='text-sm font-bold text-black'>{exp.title}</h3>
                            <p className='text-xs text-gray-600'>
                                {exp.companyName}
                                {exp.city && `, ${exp.city}`}
                                {exp.state && `, ${exp.state}`}
                            </p>
                        </div>
                        <p
                            className='text-xs'
                            style={{ color: resumeInfo?.themeColor }}
                        >
                            {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                        </p>
                    </div>

                    {exp.workSummary && (
                        <div
                            className='mt-2 text-xs leading-relaxed text-black resume-rich-text'
                            dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

export default ExperiencePreview
