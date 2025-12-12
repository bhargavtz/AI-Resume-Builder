import React from 'react';
import { ResumeContent } from '../types';
import { TemplateProps, TemplateMetadata } from './modern';

// Classic Template Component
export const ClassicTemplate: React.FC<TemplateProps> = ({ resumeInfo }) => {
    const pd = resumeInfo?.personalDetails;
    const themeColor = resumeInfo?.themeColor || '#000000';

    return (
        <div className="p-8 bg-white" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Centered Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">
                    {pd?.firstName} {pd?.lastName}
                </h1>
                <p className="text-lg mb-2">{pd?.jobTitle}</p>
                <div className="text-sm text-gray-700">
                    {pd?.address && <span>{pd.address} | </span>}
                    {pd?.phone && <span>{pd.phone} | </span>}
                    {pd?.email && <span>{pd.email}</span>}
                </div>
            </div>

            {/* Summary */}
            {resumeInfo?.summary && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400">
                        Professional Summary
                    </h2>
                    <p className="text-sm text-gray-800 leading-relaxed text-justify">
                        {resumeInfo.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400">
                        Professional Experience
                    </h2>
                    {resumeInfo.experience.map((exp) => (
                        <div key={exp.id} className="mb-3">
                            <div className="flex justify-between mb-1">
                                <h3 className="font-bold text-sm">{exp.title}</h3>
                                <span className="text-xs text-gray-600">
                                    {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            <p className="text-sm italic mb-1">
                                {exp.companyName}, {exp.city}, {exp.state}
                            </p>
                            {exp.workSummary && (
                                <div
                                    className="text-xs text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400">
                        Education
                    </h2>
                    {resumeInfo.education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                                    <p className="text-sm">{edu.universityName}</p>
                                </div>
                                <span className="text-xs text-gray-600">
                                    {edu.startDate} - {edu.endDate}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400">
                        Skills
                    </h2>
                    <p className="text-sm text-gray-800">
                        {resumeInfo.skills.map(skill => skill.name).join(' • ')}
                    </p>
                </div>
            )}
        </div>
    );
};

export const classicTemplate: TemplateMetadata = {
    id: 'classic',
    name: 'Classic Traditional',
    description: 'Timeless serif design perfect for traditional industries',
    preview: '/templates/classic-preview.png',
    category: 'classic',
    isPremium: false
};
