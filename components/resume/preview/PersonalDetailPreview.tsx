"use client"
import React from 'react'
import { ResumeContent } from '@/lib/types'

interface PersonalDetailPreviewProps {
    resumeInfo: ResumeContent | null;
}

function PersonalDetailPreview({ resumeInfo }: PersonalDetailPreviewProps) {
    const pd = resumeInfo?.personalDetails

    return (
        <div>
            <h2 className='font-bold text-xl text-center'
                style={{
                    color: resumeInfo?.themeColor
                }}
            >
                {pd?.firstName} {pd?.lastName}
            </h2>
            <h2 className='text-center text-sm font-medium text-black'>
                {pd?.jobTitle}
            </h2>
            <h2 className='text-center font-normal text-xs'
                style={{
                    color: resumeInfo?.themeColor
                }}>
                {pd?.address}
            </h2>

            <div className='flex justify-between'>
                <h2 className='font-normal text-xs'
                    style={{
                        color: resumeInfo?.themeColor
                    }}>
                    {pd?.phone}
                </h2>
                <h2 className='font-normal text-xs'
                    style={{
                        color: resumeInfo?.themeColor
                    }}>
                    {pd?.email}
                </h2>
            </div>
            <hr className='border-[1.5px] my-2'
                style={{
                    borderColor: resumeInfo?.themeColor
                }}
            />
        </div>
    )
}

export default PersonalDetailPreview
