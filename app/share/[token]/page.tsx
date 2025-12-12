"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ResumeContent } from '@/lib/types';
import { getTemplateComponent } from '@/lib/templates';
import { Loader2 } from 'lucide-react';

export default function SharePage() {
    const params = useParams();
    const [resumeData, setResumeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await axios.get(`/api/share/${params.token}`);
                setResumeData(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Resume not found');
            } finally {
                setLoading(false);
            }
        };

        if (params.token) {
            fetchResume();
        }
    }, [params.token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !resumeData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Resume Not Found</h1>
                    <p className="text-muted-foreground">{error || 'This resume is not available'}</p>
                </div>
            </div>
        );
    }

    const TemplateComponent = getTemplateComponent(resumeData.templateId || 'modern');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <TemplateComponent resumeInfo={resumeData.content} />
                </div>
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>Created with AI Resume Builder</p>
                </div>
            </div>
        </div>
    );
}
