"use client"
import React, { useEffect, useState, use, useRef } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import ResumePreview from '@/components/resume/ResumePreview'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Edit, Share2, Loader2, FileText, File } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'sonner'
import { ResumeContent } from '@/lib/types'
import { exportToDocx } from '@/lib/exportUtils'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ViewResume({ params }: { params: Promise<{ resumeId: string }> }) {
    const { resumeId } = use(params);
    const [resumeInfo, setResumeInfo] = useState<ResumeContent | null>(null);
    const [resumeTitle, setResumeTitle] = useState<string>('Resume');
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const resumeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        GetResumeInfo();
    }, [resumeId])

    const GetResumeInfo = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/resumes/' + resumeId);
            setResumeInfo(result.data.content || {});
            setResumeTitle(result.data.title || 'Resume');
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error fetching resume:', e);
            }
            toast.error('Failed to load resume');
        } finally {
            setLoading(false);
        }
    }

    const handleDownloadPDF = async () => {
        if (!resumeRef.current) return;

        setDownloading(true);
        try {
            // Force light theme for PDF export
            const originalTheme = document.documentElement.getAttribute('data-theme');
            const originalClass = document.documentElement.className;

            // Temporarily set light theme
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.remove('dark');

            // Small delay to ensure theme is applied
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture the resume as canvas
            const canvas = await html2canvas(resumeRef.current, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Restore original theme
            if (originalTheme) {
                document.documentElement.setAttribute('data-theme', originalTheme);
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            if (originalClass.includes('dark')) {
                document.documentElement.classList.add('dark');
            }

            // Convert canvas to PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Download the PDF
            const filename = `${resumeTitle.replace(/[^a-z0-9]/gi, '_')}_Resume.pdf`;
            pdf.save(filename);

            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF download error:', error);
            toast.error('Failed to download PDF');
        } finally {
            setDownloading(false);
        }
    }

    const handleDownloadDOCX = async () => {
        if (!resumeInfo) return;

        setDownloading(true);
        try {
            const blob = await exportToDocx(resumeInfo, resumeTitle);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${resumeTitle.replace(/[^a-z0-9]/gi, '_')}_Resume.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('DOCX downloaded successfully!');
        } catch (error) {
            console.error('DOCX download error:', error);
            toast.error('Failed to download DOCX');
        } finally {
            setDownloading(false);
        }
    }

    const handleShare = async () => {
        try {
            const response = await axios.post(`/api/resumes/${resumeId}/share`);
            const { shareToken } = response.data;

            const shareUrl = `${window.location.origin}/share/${shareToken}`;

            if (navigator.share) {
                await navigator.share({
                    title: resumeTitle,
                    text: `Check out my resume: ${resumeTitle}`,
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Share link copied to clipboard!');
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Share error:', error);
            }
            toast.error('Failed to generate share link');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard">
                                    <Button variant="outline" size="icon">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">{resumeTitle}</h1>
                                    <p className="text-muted-foreground">Resume Preview</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleShare}
                                    className="flex items-center gap-2"
                                >
                                    <Share2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Share</span>
                                </Button>

                                <Link href={`/dashboard/resume/${resumeId}/edit`}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </Button>
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button disabled={downloading} className="flex items-center gap-2">
                                            {downloading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                            <span className="hidden sm:inline">
                                                {downloading ? 'Downloading...' : 'Download'}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleDownloadPDF} className="cursor-pointer">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Download as PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDownloadDOCX} className="cursor-pointer">
                                            <File className="mr-2 h-4 w-4" />
                                            Download as DOCX
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    {/* Resume Preview */}
                    <div className="flex justify-center">
                        <div
                            ref={resumeRef}
                            className="w-full max-w-[8.5in] aspect-[8.5/11] bg-white shadow-2xl rounded-lg overflow-hidden"
                        >
                            <ResumePreview />
                        </div>
                    </div>

                    {/* Download Tip */}
                    <div className="mt-8 text-center">
                        <p className="text-muted-foreground text-sm">
                            💡 Tip: For best results, use the Download PDF button to get a print-ready version of your resume.
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </ResumeInfoContext.Provider>
    )
}
