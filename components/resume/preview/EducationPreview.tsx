"use client"
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'

function EducationPreview() {
    const { resumeInfo } = useContext(ResumeInfoContext)

    if (!resumeInfo?.education || resumeInfo.education.length === 0) return null

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
                EDUCATION
            </h2>

            {resumeInfo.education.map((edu: any, index: number) => (
                <div key={edu.id || index} className='mb-3'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <h3 className='text-sm font-bold text-black'>{edu.universityName}</h3>
                            <p className='text-xs text-black'>
                                {edu.degree}
                                {edu.major && ` in ${edu.major}`}
                            </p>
                        </div>
                        <p
                            className='text-xs'
                            style={{ color: resumeInfo?.themeColor }}
                        >
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                    </div>

                    {edu.description && (
                        <div
                            className='mt-1 text-xs text-gray-600 resume-rich-text'
                            dangerouslySetInnerHTML={{ __html: edu.description }}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

export default EducationPreview
