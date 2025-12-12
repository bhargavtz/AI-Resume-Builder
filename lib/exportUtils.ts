/**
 * Export Utilities
 * Async PDF and DOCX export with progress tracking
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ResumeContent } from './types';
import { convertHtmlToDocx } from './htmlToDocx';

export interface ExportProgress {
    stage: 'preparing' | 'capturing' | 'generating' | 'complete';
    progress: number; // 0-100
    message: string;
}

export interface ExportOptions {
    filename?: string;
    quality?: number; // 0-1
    onProgress?: (progress: ExportProgress) => void;
    signal?: AbortSignal; // For cancellation
}

/**
 * Asynchronously export HTML element to PDF
 * Returns a Promise that resolves with the PDF blob
 */
export async function exportToPdfAsync(
    element: HTMLElement,
    options: ExportOptions = {}
): Promise<Blob> {
    const {
        filename = 'resume.pdf',
        quality = 0.95,
        onProgress,
        signal
    } = options;

    return new Promise((resolve, reject) => {
        // Check for cancellation
        if (signal?.aborted) {
            reject(new Error('Export cancelled'));
            return;
        }

        // Stage 1: Preparing
        onProgress?.({
            stage: 'preparing',
            progress: 10,
            message: 'Preparing document...'
        });

        // Use setTimeout to make it async and non-blocking
        setTimeout(async () => {
            try {
                // Check for cancellation
                if (signal?.aborted) {
                    reject(new Error('Export cancelled'));
                    return;
                }

                // Stage 2: Capturing
                onProgress?.({
                    stage: 'capturing',
                    progress: 30,
                    message: 'Capturing content...'
                });

                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                });

                // Check for cancellation
                if (signal?.aborted) {
                    reject(new Error('Export cancelled'));
                    return;
                }

                // Stage 3: Generating PDF
                onProgress?.({
                    stage: 'generating',
                    progress: 70,
                    message: 'Generating PDF...'
                });

                const imgData = canvas.toDataURL('image/jpeg', quality);
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 0;

                pdf.addImage(
                    imgData,
                    'JPEG',
                    imgX,
                    imgY,
                    imgWidth * ratio,
                    imgHeight * ratio
                );

                // Stage 4: Complete
                onProgress?.({
                    stage: 'complete',
                    progress: 100,
                    message: 'Export complete!'
                });

                // Convert to blob
                const blob = pdf.output('blob');
                resolve(blob);

            } catch (error) {
                reject(error);
            }
        }, 100); // Small delay to allow UI to update
    });
}

/**
 * Download PDF blob with given filename
 */
export function downloadPdfBlob(blob: Blob, filename: string = 'resume.pdf') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Complete export flow with progress tracking
 */
export async function exportResumeWithProgress(
    elementId: string,
    filename: string,
    onProgress?: (progress: ExportProgress) => void
): Promise<void> {
    const element = document.getElementById(elementId);

    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    const blob = await exportToPdfAsync(element, {
        filename,
        onProgress,
    });

    downloadPdfBlob(blob, filename);
}

/**
 * Export resume to DOCX format
 */
export async function exportToDocx(resumeInfo: ResumeContent, title: string): Promise<Blob> {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Personal Details
                new Paragraph({
                    text: `${resumeInfo.personalDetails?.firstName || ''} ${resumeInfo.personalDetails?.lastName || ''}`,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: resumeInfo.personalDetails?.jobTitle || '',
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${resumeInfo.personalDetails?.phone || ''} | ${resumeInfo.personalDetails?.email || ''}`,
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: resumeInfo.personalDetails?.address || '',
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: '' }), // Spacing

                // Summary
                ...(resumeInfo.summary ? [
                    new Paragraph({
                        text: 'PROFESSIONAL SUMMARY',
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: resumeInfo.summary,
                    }),
                    new Paragraph({ text: '' }),
                ] : []),

                // Experience
                ...(resumeInfo.experience && resumeInfo.experience.length > 0 ? [
                    new Paragraph({
                        text: 'PROFESSIONAL EXPERIENCE',
                        heading: HeadingLevel.HEADING_2,
                    }),
                    ...resumeInfo.experience.flatMap((exp: any) => [
                        new Paragraph({
                            text: exp.title || '',
                            heading: HeadingLevel.HEADING_3,
                        }),
                        new Paragraph({
                            text: `${exp.companyName || ''} | ${exp.city || ''}, ${exp.state || ''}`,
                        }),
                        new Paragraph({
                            text: `${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''}`,
                        }),
                        // Convert HTML work summary to DOCX paragraphs
                        ...convertHtmlToDocx(exp.workSummary || ''),
                        new Paragraph({ text: '' }),
                    ]),
                ] : []),

                // Education
                ...(resumeInfo.education && resumeInfo.education.length > 0 ? [
                    new Paragraph({
                        text: 'EDUCATION',
                        heading: HeadingLevel.HEADING_2,
                    }),
                    ...resumeInfo.education.flatMap((edu: any) => [
                        new Paragraph({
                            text: edu.universityName || '',
                            heading: HeadingLevel.HEADING_3,
                        }),
                        new Paragraph({
                            text: `${edu.degree || ''} ${edu.major ? `in ${edu.major}` : ''}`,
                        }),
                        new Paragraph({
                            text: `${edu.startDate || ''} - ${edu.endDate || ''}`,
                        }),
                        // Convert HTML description to DOCX paragraphs
                        ...(edu.description ? convertHtmlToDocx(edu.description) : []),
                        new Paragraph({ text: '' }),
                    ]),
                ] : []),

                // Skills
                ...(resumeInfo.skills && resumeInfo.skills.length > 0 ? [
                    new Paragraph({
                        text: 'SKILLS',
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: resumeInfo.skills.map((skill: any) => skill.name).join(', '),
                    }),
                ] : []),
            ],
        }],
    });

    return await Packer.toBlob(doc);
}
