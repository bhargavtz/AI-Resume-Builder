import React from 'react';
import { TemplateProps, TemplateMetadata } from './modern';

// Creative Template Component
export const CreativeTemplate: React.FC<TemplateProps> = ({ resumeInfo }) => {
    const pd = resumeInfo?.personalDetails;
    const themeColor = resumeInfo?.themeColor || '#8b5cf6';

    return (
        <div className="p-8 bg-gradient-to-br from-white to-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Creative Header with Gradient */}
            <div
                className="p-6 rounded-2xl mb-6 text-white"
                style={{
                    background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`
                }}
            >
                <h1 className="text-3xl font-bold mb-2">
                    {pd?.firstName} {pd?.lastName}
                </h1>
                <p className="text-lg opacity-90 mb-3">{pd?.jobTitle}</p>
                <div className="flex flex-wrap gap-4 text-sm opacity-80">
                    {pd?.email && <span>✉ {pd.email}</span>}
                    {pd?.phone && <span>📞 {pd.phone}</span>}
                    {pd?.address && <span>📍 {pd.address}</span>}
                </div>
            </div>

            {/* Summary with Icon */}
            {resumeInfo?.summary && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: themeColor }}
                        >
                            ✦
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: themeColor }}>
                            About Me
                        </h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed pl-10">{resumeInfo.summary}</p>
                </div>
            )}

            {/* Experience with Timeline */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: themeColor }}
                        >
                            💼
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: themeColor }}>
                            Experience
                        </h2>
                    </div>
                    <div className="pl-10 space-y-4">
                        {resumeInfo.experience.map((exp, index) => (
                            <div key={exp.id} className="relative">
                                {index !== resumeInfo.experience!.length - 1 && (
                                    <div
                                        className="absolute left-[-24px] top-8 w-0.5 h-full"
                                        style={{ backgroundColor: `${themeColor}30` }}
                                    />
                                )}
                                <div
                                    className="absolute left-[-28px] top-2 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: themeColor }}
                                />
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                        <span
                                            className="text-xs px-2 py-1 rounded-full"
                                            style={{
                                                backgroundColor: `${themeColor}15`,
                                                color: themeColor
                                            }}
                                        >
                                            {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {exp.companyName} • {exp.city}, {exp.state}
                                    </p>
                                    {exp.workSummary && (
                                        <div
                                            className="text-sm text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: themeColor }}
                        >
                            🎓
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: themeColor }}>
                            Education
                        </h2>
                    </div>
                    <div className="pl-10 space-y-3">
                        {resumeInfo.education.map((edu) => (
                            <div key={edu.id} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-sm text-gray-600">{edu.universityName}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills with Pills */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: themeColor }}
                        >
                            ⚡
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: themeColor }}>
                            Skills
                        </h2>
                    </div>
                    <div className="pl-10 flex flex-wrap gap-2">
                        {resumeInfo.skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                                style={{
                                    backgroundColor: `${themeColor}20`,
                                    color: themeColor,
                                    border: `1px solid ${themeColor}40`
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

export const creativeTemplate: TemplateMetadata = {
    id: 'creative',
    name: 'Creative Bold',
    description: 'Eye-catching design with gradients and modern elements',
    preview: '/templates/creative-preview.png',
    category: 'creative',
    isPremium: true
};
