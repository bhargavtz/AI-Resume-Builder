"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import GlobalApi from '@/service/GlobalApi'
import { toast } from 'sonner'
import { EducationEntry } from '@/lib/types'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

const defaultEducation: EducationEntry = {
    id: '',
    universityName: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: ''
}

function Education({ enabledNext }: { enabledNext: (v: boolean) => void }) {
    const params = useParams()
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

    const [educationList, setEducationList] = useState<EducationEntry[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (resumeInfo?.education && resumeInfo.education.length > 0) {
            setEducationList(resumeInfo.education)
            enabledNext(true)
        } else {
            setEducationList([{ ...defaultEducation, id: Date.now().toString() }])
        }
    }, [])

    const handleChange = (index: number, field: string, value: string) => {
        const updatedList = [...educationList]
        updatedList[index] = { ...updatedList[index], [field]: value }
        setEducationList(updatedList)
        setResumeInfo({ ...resumeInfo, education: updatedList })
    }

    const addEducation = () => {
        const newEntry = { ...defaultEducation, id: Date.now().toString() }
        setEducationList([...educationList, newEntry])
    }

    const removeEducation = (index: number) => {
        if (educationList.length === 1) {
            toast.error("You need at least one education entry")
            return
        }
        const updatedList = educationList.filter((_, i) => i !== index)
        setEducationList(updatedList)
        setResumeInfo({ ...resumeInfo, education: updatedList })
    }

    const onSave = async () => {
        setLoading(true)
        try {
            await GlobalApi.UpdateResumeDetail(params.resumeId as string, {
                content: { ...resumeInfo, education: educationList }
            })
            enabledNext(true)
            toast.success("Education saved successfully!")
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error saving education:', error)
            }
            toast.error("Failed to save education")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-lg'>Education</h2>
                    <p className='text-sm text-muted-foreground'>Add your educational background</p>
                </div>
            </div>

            {educationList.map((edu, index) => (
                <div key={edu.id} className='border rounded-lg p-4 mt-5 relative'>
                    {educationList.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive hover:text-destructive"
                            onClick={() => removeEducation(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}

                    <div className='grid grid-cols-2 gap-3'>
                        <div className='col-span-2'>
                            <label className='text-sm'>University/School Name</label>
                            <Input
                                value={edu.universityName}
                                onChange={(e) => handleChange(index, 'universityName', e.target.value)}
                                placeholder="Harvard University"
                            />
                        </div>
                        <div>
                            <label className='text-sm'>Degree</label>
                            <Input
                                value={edu.degree}
                                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                placeholder="Bachelor's Degree"
                            />
                        </div>
                        <div>
                            <label className='text-sm'>Major/Field of Study</label>
                            <Input
                                value={edu.major}
                                onChange={(e) => handleChange(index, 'major', e.target.value)}
                                placeholder="Computer Science"
                            />
                        </div>
                        <div>
                            <label className='text-sm'>Start Date</label>
                            <Input
                                type="date"
                                value={edu.startDate}
                                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className='text-sm'>End Date</label>
                            <Input
                                type="date"
                                value={edu.endDate}
                                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                            />
                        </div>
                        <div className='col-span-2'>
                            <label className='text-sm'>Description (Optional)</label>
                            <RichTextEditor
                                value={edu.description || ''}
                                onChange={(value) => handleChange(index, 'description', value)}
                                placeholder="GPA: 3.8/4.0, Dean's List, Relevant coursework..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className='flex justify-between mt-5'>
                <Button variant="outline" onClick={addEducation} className="flex gap-2">
                    <Plus className="h-4 w-4" /> Add Education
                </Button>
                <Button onClick={onSave} disabled={loading}>
                    {loading ? <Loader2 className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    )
}

export default Education
