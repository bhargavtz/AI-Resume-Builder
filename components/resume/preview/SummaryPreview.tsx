"use client"
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'

function SummaryPreview() {
    const { resumeInfo } = useContext(ResumeInfoContext)

    if (!resumeInfo?.summary) return null

    return (
        <div className='my-6'>
            <h2
                className='text-center font-bold text-sm mb-2'
                style={{ color: resumeInfo?.themeColor }}
            >
                PROFESSIONAL SUMMARY
            </h2>
            <p className='text-xs text-justify leading-relaxed text-black'>
                {resumeInfo.summary}
            </p>
        </div>
    )
}

export default SummaryPreview
