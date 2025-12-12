"use client"
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'

function SkillsPreview() {
    const { resumeInfo } = useContext(ResumeInfoContext)

    if (!resumeInfo?.skills || resumeInfo.skills.length === 0) return null

    return (
        <div className='my-6'>
            <h2
                className='text-center font-bold text-sm mb-2'
                style={{ color: resumeInfo?.themeColor }}
            >
                SKILLS
            </h2>

            <div className='grid grid-cols-2 gap-2'>
                {resumeInfo.skills.map((skill: any, index: number) => {
                    // Handle both SkillEntry format and legacy SuggestedSkill format
                    const skillName = typeof skill === 'string' ? skill : (skill.name || '');
                    const skillRating = skill.rating || 80; // Default rating if not present

                    if (!skillName) return null; // Skip invalid entries

                    return (
                        <div key={skill.id || index} className='flex items-center gap-2'>
                            <span className='text-xs flex-1 text-black'>{skillName}</span>
                            <div className='w-16 h-2 bg-gray-200 rounded-full overflow-hidden'>
                                <div
                                    className='h-full rounded-full'
                                    style={{
                                        width: `${skillRating}%`,
                                        backgroundColor: resumeInfo?.themeColor
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default SkillsPreview
