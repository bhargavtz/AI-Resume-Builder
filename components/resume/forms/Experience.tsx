"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Loader2, Plus, Trash2, Sparkles } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import GlobalApi from '@/service/GlobalApi'
import { toast } from 'sonner'
import axios from 'axios'
import { ExperienceEntry } from '@/lib/types'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

const defaultExperience: ExperienceEntry = {
    id: '',
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    workSummary: ''
}

function Experience({ enabledNext }: { enabledNext: (v: boolean) => void }) {
    const params = useParams()
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

    const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState<string | null>(null)

    useEffect(() => {
        if (resumeInfo?.experience && resumeInfo.experience.length > 0) {
            setExperienceList(resumeInfo.experience)
            enabledNext(true)
        } else {
            setExperienceList([{ ...defaultExperience, id: Date.now().toString() }])
        }
    }, [])

    const handleChange = (index: number, field: string, value: any) => {
        const updatedList = [...experienceList]
        updatedList[index] = { ...updatedList[index], [field]: value }
        setExperienceList(updatedList)
        setResumeInfo({ ...resumeInfo, experience: updatedList })
    }

    const addExperience = () => {
        const newEntry = { ...defaultExperience, id: Date.now().toString() }
        setExperienceList([...experienceList, newEntry])
    }

    const removeExperience = (index: number) => {
        if (experienceList.length === 1) {
            toast.error("You need at least one experience entry")
            return
        }
        const updatedList = experienceList.filter((_, i) => i !== index)
        setExperienceList(updatedList)
        setResumeInfo({ ...resumeInfo, experience: updatedList })
    }

    const generateBullets = async (index: number) => {
        const exp = experienceList[index]
        if (!exp.title || !exp.companyName) {
            toast.error("Please add job title and company name first")
            return
        }

        setAiLoading(exp.id)
        try {
            const response = await axios.post('/api/ai/generate-bullets', {
                context: 'experience',
                jobTitle: exp.title,
                companyName: exp.companyName,
                experience: exp.workSummary
            })

            const bullets = response.data.bullets
            // Convert array of bullets to HTML string format
            const htmlBullets = Array.isArray(bullets)
                ? `<ul>${bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
                : bullets
            handleChange(index, 'workSummary', htmlBullets)
            toast.success("Bullet points generated!")
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error generating bullets:', error)
            }
            toast.error("Failed to generate bullet points")
        } finally {
            setAiLoading(null)
        }
    }

    const onSave = async () => {
        setLoading(true)
        try {
            await GlobalApi.UpdateResumeDetail(params.resumeId as string, {
                content: { ...resumeInfo, experience: experienceList }
            })
            enabledNext(true)
            toast.success("Experience saved successfully!")
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error saving experience:', error)
            }
            toast.error("Failed to save experience")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-lg'>Professional Experience</h2>
                    <p className='text-sm text-muted-foreground'>Add your previous job experience</p>
                </div>
            </div>

            {experienceList.map((exp, index) => (
                <div key={exp.id} className='border rounded-lg p-4 mt-5 relative'>
                    {experienceList.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive hover:text-destructive"
                            onClick={() => removeExperience(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}

                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label className='text-sm'>Position Title</label>
                            <Input
                                value={exp.title}
                                onChange={(e) => handleChange(index, 'title', e.target.value)}
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div>
                            <label className='text-sm'>Company Name</label>
                            <Input
                                value={exp.companyName}
                                onChange={(e) => handleChange(index, 'companyName', e.target.value)}
                                placeholder="Google"
                            />
                        </div>
                        <div>
                            <label className='text-sm'>City</label>
                            <Input
                                value={exp.city}
                                onChange={(e) => handleChange(index, 'city', e.target.value)}
                                placeholder="New York"
                            />
                        </div>
                        <div>
                            <label className='text-sm'>State</label>
                            <Input
                                value={exp.state}
                                onChange={(e) => handleChange(index, 'state', e.target.value)}
                                placeholder="NY"
                            />
                        </div>
                        <div>
                            <label className='text-sm'>Start Date</label>
                            <Input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className='text-sm'>End Date</label>
                            <Input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                disabled={exp.currentlyWorking}
                            />
                        </div>
                        <div className='col-span-2 flex items-center gap-2'>
                            <input
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.currentlyWorking}
                                onChange={(e) => handleChange(index, 'currentlyWorking', e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor={`current-${exp.id}`} className='text-sm'>
                                I currently work here
                            </label>
                        </div>
                        <div className='col-span-2'>
                            <div className='flex justify-between items-center mb-1'>
                                <label className='text-sm'>Work Summary</label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => generateBullets(index)}
                                    disabled={aiLoading === exp.id}
                                    className="flex gap-1 text-xs"
                                >
                                    {aiLoading === exp.id ? (
                                        <Loader2 className='h-3 w-3 animate-spin' />
                                    ) : (
                                        <Sparkles className='h-3 w-3' />
                                    )}
                                    Generate with AI
                                </Button>
                            </div>
                            <RichTextEditor
                                value={exp.workSummary || ''}
                                onChange={(value) => handleChange(index, 'workSummary', value)}
                                placeholder="• Developed and maintained web applications&#10;• Collaborated with cross-functional teams&#10;• Improved system performance by 40%"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className='flex justify-between mt-5'>
                <Button variant="outline" onClick={addExperience} className="flex gap-2">
                    <Plus className="h-4 w-4" /> Add Experience
                </Button>
                <Button onClick={onSave} disabled={loading}>
                    {loading ? <Loader2 className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    )
}

export default Experience
