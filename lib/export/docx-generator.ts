import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } from 'docx';
import { ResumeContent } from '../types';

export async function generateDOCX(resumeContent: ResumeContent): Promise<Blob> {
    const pd = resumeContent.personalDetails;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header - Name
                new Paragraph({
                    text: `${pd?.firstName || ''} ${pd?.lastName || ''}`,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 }
                }),

                // Job Title
                new Paragraph({
                    text: pd?.jobTitle || '',
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 }
                }),

                // Contact Info
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [
                        new TextRun({ text: pd?.email || '', size: 20 }),
                        new TextRun({ text: ' | ', size: 20 }),
                        new TextRun({ text: pd?.phone || '', size: 20 }),
                        new TextRun({ text: ' | ', size: 20 }),
                        new TextRun({ text: pd?.address || '', size: 20 }),
                    ]
                }),

                // Summary Section
                ...(resumeContent.summary ? [
                    new Paragraph({
                        text: 'PROFESSIONAL SUMMARY',
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 200 },
                        border: {
                            bottom: {
                                color: "000000",
                                space: 1,
                                style: "single",
                                size: 6
                            }
                        }
                    }),
                    new Paragraph({
                        text: resumeContent.summary,
                        spacing: { after: 400 }
                    })
                ] : []),

                // Experience Section
                ...(resumeContent.experience && resumeContent.experience.length > 0 ? [
                    new Paragraph({
                        text: 'PROFESSIONAL EXPERIENCE',
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 200 },
                        border: {
                            bottom: {
                                color: "000000",
                                space: 1,
                                style: "single",
                                size: 6
                            }
                        }
                    }),
                    ...resumeContent.experience.flatMap(exp => [
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({ text: exp.title || '', bold: true, size: 24 }),
                                new TextRun({ text: ` | ${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate}`, size: 20 })
                            ]
                        }),
                        new Paragraph({
                            spacing: { after: 100 },
                            children: [
                                new TextRun({
                                    text: `${exp.companyName}, ${exp.city}, ${exp.state}`,
                                    italics: true
                                })
                            ]
                        }),
                        new Paragraph({
                            text: exp.workSummary?.replace(/<[^>]*>/g, '') || '',
                            spacing: { after: 200 }
                        })
                    ])
                ] : []),

                // Education Section
                ...(resumeContent.education && resumeContent.education.length > 0 ? [
                    new Paragraph({
                        text: 'EDUCATION',
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 200 },
                        border: {
                            bottom: {
                                color: "000000",
                                space: 1,
                                style: "single",
                                size: 6
                            }
                        }
                    }),
                    ...resumeContent.education.flatMap(edu => [
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({ text: edu.degree || '', bold: true, size: 24 }),
                                new TextRun({ text: ` | ${edu.startDate} - ${edu.endDate}`, size: 20 })
                            ]
                        }),
                        new Paragraph({
                            text: edu.universityName || '',
                            spacing: { after: 200 }
                        })
                    ])
                ] : []),

                // Skills Section
                ...(resumeContent.skills && resumeContent.skills.length > 0 ? [
                    new Paragraph({
                        text: 'SKILLS',
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 200 },
                        border: {
                            bottom: {
                                color: "000000",
                                space: 1,
                                style: "single",
                                size: 6
                            }
                        }
                    }),
                    new Paragraph({
                        text: resumeContent.skills.map(s => s.name).join(' • '),
                        spacing: { after: 200 }
                    })
                ] : [])
            ]
        }]
    });

    return await Packer.toBlob(doc);
}

export function downloadDOCX(blob: Blob, filename: string = 'resume.docx') {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
