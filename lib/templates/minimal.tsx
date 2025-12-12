import React from 'react';
import { TemplateProps, TemplateMetadata } from './modern';

// Minimal Template Component
export const MinimalTemplate: React.FC<TemplateProps> = ({ resumeInfo }) => {
    const pd = resumeInfo?.personalDetails;

    return (
        <div className="p-8 bg-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            {/* Minimal Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-light mb-1">
                    {pd?.firstName} {pd?.lastName}
                </h1>
                <p className="text-sm text-gray-600 mb-2">{pd?.jobTitle}</p>
                <div className="text-xs text-gray-500 space-x-3">
                    {pd?.email && <span>{pd.email}</span>}
                    {pd?.phone && <span>{pd.phone}</span>}
                    {pd?.address && <span>{pd.address}</span>}
                </div>
            </div>

            {/* Summary */}
            {resumeInfo?.summary && (
                <div className="mb-6">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {resumeInfo.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                        Experience
                    </h2>
                    {resumeInfo.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-sm font-medium">{exp.title}</h3>
                                <span className="text-xs text-gray-500">
                                    {exp.startDate} — {exp.currentlyWorking ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                                {exp.companyName}
                            </p>
                            {exp.workSummary && (
                                <div
                                    className="text-xs text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                        Education
                    </h2>
                    {resumeInfo.education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="text-sm font-medium">{edu.degree}</h3>
                                    <p className="text-xs text-gray-600">{edu.universityName}</p>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {edu.startDate} — {edu.endDate}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                        Skills
                    </h2>
                    <div className="text-xs text-gray-700">
                        {resumeInfo.skills.map(skill => skill.name).join(', ')}
                    </div>
                </div>
            )}
        </div>
    );
};

export const minimalTemplate: TemplateMetadata = {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Ultra-clean minimalist design with maximum readability',
    preview: '/templates/minimal-preview.png',
    category: 'minimal',
    isPremium: false
};
