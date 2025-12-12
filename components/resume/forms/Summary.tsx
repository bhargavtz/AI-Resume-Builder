"use client"
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Loader2, Sparkles } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import GlobalApi from '@/service/GlobalApi'
import { toast } from 'sonner'
import axios from 'axios'

function Summary({ enabledNext }: { enabledNext: (v: boolean) => void }) {
    const params = useParams()
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)

    useEffect(() => {
        if (resumeInfo?.summary) {
            setSummary(resumeInfo.summary)
            enabledNext(true)
        }
    }, [resumeInfo?.summary])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setSummary(value)
        setResumeInfo({
            ...resumeInfo,
            summary: value
        })
        enabledNext(value.length > 0)
    }

    const generateSummary = async () => {
        if (!resumeInfo?.personalDetails?.jobTitle) {
            toast.error("Please add your job title in Personal Details first")
            return
        }

        setAiLoading(true)
        try {
            const response = await axios.post('/api/ai/generate-summary', {
                jobTitle: resumeInfo.personalDetails.jobTitle,
                experience: resumeInfo.experience || [],
                skills: resumeInfo.skills || []
            })

            const generatedSummary = response.data.summary
            setSummary(generatedSummary)
            setResumeInfo({
                ...resumeInfo,
                summary: generatedSummary
            })
            enabledNext(true)
            toast.success("Summary generated successfully!")
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error generating summary:', error)
            }

            // Handle rate limit error specifically
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                toast.error("AI is busy right now. Please wait a moment and try again.", {
                    duration: 5000,
                    description: "Too many requests. The system will retry automatically."
                })
            } else {
                toast.error("Failed to generate summary. Please try again.")
            }
        } finally {
            setAiLoading(false)
        }
    }

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await GlobalApi.UpdateResumeDetail(params.resumeId as string, {
                content: { ...resumeInfo, summary }
            })
            enabledNext(true)
            toast.success("Summary saved successfully!")
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error saving summary:', error)
            }
            toast.error("Failed to save summary")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-lg'>Professional Summary</h2>
                    <p className='text-sm text-muted-foreground'>Add a brief professional summary</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSummary}
                    disabled={aiLoading}
                    className="flex gap-2"
                >
                    {aiLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                        <Sparkles className='h-4 w-4' />
                    )}
                    Generate with AI
                </Button>
            </div>

            <form onSubmit={onSave} className='mt-5'>
                <textarea
                    name="summary"
                    value={summary}
                    onChange={handleChange}
                    placeholder="A passionate software developer with 5+ years of experience..."
                    className='w-full min-h-[150px] p-3 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary'
                    maxLength={500}
                />
                <div className='flex justify-between items-center mt-2'>
                    <span className='text-xs text-muted-foreground'>
                        {summary.length}/500 characters
                    </span>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Summary
