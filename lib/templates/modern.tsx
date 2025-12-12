import React from 'react';
import { ResumeContent } from '../types';

export interface TemplateProps {
    resumeInfo: ResumeContent | null;
}

export interface TemplateMetadata {
    id: string;
    name: string;
    description: string;
    preview: string;
    category: 'modern' | 'classic' | 'minimal' | 'creative';
    isPremium: boolean;
}

// Modern Template Component
export const ModernTemplate: React.FC<TemplateProps> = ({ resumeInfo }) => {
    const pd = resumeInfo?.personalDetails;
    const themeColor = resumeInfo?.themeColor || '#3b82f6';

    return (
        <div className="p-8 bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header with colored sidebar */}
            <div className="flex gap-6 mb-6">
                <div
                    className="w-2 rounded-full"
                    style={{ backgroundColor: themeColor }}
                />
                <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-1" style={{ color: themeColor }}>
                        {pd?.firstName} {pd?.lastName}
                    </h1>
                    <p className="text-xl text-gray-600 mb-3">{pd?.jobTitle}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {pd?.email && <span>✉ {pd.email}</span>}
                        {pd?.phone && <span>📞 {pd.phone}</span>}
                        {pd?.address && <span>📍 {pd.address}</span>}
                    </div>
                </div>
            </div>

            {/* Summary */}
            {resumeInfo?.summary && (
                <div className="mb-6">
                    <h2
                        className="text-lg font-bold mb-2 pb-1 border-b-2"
                        style={{ borderColor: themeColor, color: themeColor }}
                    >
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{resumeInfo.summary}</p>
                </div>
            )}

            {/* Experience */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <div className="mb-6">
                    <h2
                        className="text-lg font-bold mb-3 pb-1 border-b-2"
                        style={{ borderColor: themeColor, color: themeColor }}
                    >
                        EXPERIENCE
                    </h2>
                    {resumeInfo.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                <span className="text-sm text-gray-600">
                                    {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-1">
                                {exp.companyName} • {exp.city}, {exp.state}
                            </p>
                            {exp.workSummary && (
                                <div
                                    className="text-gray-600 text-sm"
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
                    <h2
                        className="text-lg font-bold mb-3 pb-1 border-b-2"
                        style={{ borderColor: themeColor, color: themeColor }}
                    >
                        EDUCATION
                    </h2>
                    {resumeInfo.education.map((edu) => (
                        <div key={edu.id} className="mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                    <p className="text-gray-700">{edu.universityName}</p>
                                </div>
                                <span className="text-sm text-gray-600">
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
                    <h2
                        className="text-lg font-bold mb-3 pb-1 border-b-2"
                        style={{ borderColor: themeColor, color: themeColor }}
                    >
                        SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {resumeInfo.skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                    backgroundColor: `${themeColor}15`,
                                    color: themeColor
                                }}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const modernTemplate: TemplateMetadata = {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design with colored accents',
    preview: '/templates/modern-preview.png',
    category: 'modern',
    isPremium: false
};
