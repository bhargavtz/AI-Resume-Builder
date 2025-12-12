"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Loader2, Plus, X, Sparkles } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import GlobalApi from '@/service/GlobalApi'
import { toast } from 'sonner'
import axios from 'axios'
import { SkillEntry } from '@/lib/types'

function Skills({ enabledNext }: { enabledNext: (v: boolean) => void }) {
    const params = useParams()
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

    const [skillsList, setSkillsList] = useState<SkillEntry[]>([])
    const [newSkill, setNewSkill] = useState('')
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)

    useEffect(() => {
        if (resumeInfo?.skills && resumeInfo.skills.length > 0) {
            setSkillsList(resumeInfo.skills)
            enabledNext(true)
        }
    }, [])

    const addSkill = () => {
        if (!newSkill.trim()) return

        const newEntry: SkillEntry = {
            id: Date.now().toString(),
            name: newSkill.trim(),
            rating: 80
        }

        const updatedList = [...skillsList, newEntry]
        setSkillsList(updatedList)
        setResumeInfo({ ...resumeInfo, skills: updatedList })
        setNewSkill('')
        enabledNext(true)
    }

    const removeSkill = (id: string) => {
        const updatedList = skillsList.filter(skill => skill.id !== id)
        setSkillsList(updatedList)
        setResumeInfo({ ...resumeInfo, skills: updatedList })
    }

    const updateRating = (id: string, rating: number) => {
        const updatedList = skillsList.map(skill =>
            skill.id === id ? { ...skill, rating } : skill
        )
        setSkillsList(updatedList)
        setResumeInfo({ ...resumeInfo, skills: updatedList })
    }

    const suggestSkills = async () => {
        if (!resumeInfo?.personalDetails?.jobTitle) {
            toast.error("Please add your job title in Personal Details first")
            return
        }

        setAiLoading(true)
        try {
            const response = await axios.post('/api/ai/suggest-skills', {
                jobTitle: resumeInfo.personalDetails.jobTitle,
                existingSkills: skillsList.map(s => s.name)
            })

            const suggestedSkills = response.data.skills || []
            const newSkills: SkillEntry[] = suggestedSkills.map((skill: any) => ({
                id: Date.now().toString() + Math.random(),
                name: typeof skill === 'string' ? skill : skill.name,
                rating: 75
            }))

            const updatedList = [...skillsList, ...newSkills]
            setSkillsList(updatedList)
            setResumeInfo({ ...resumeInfo, skills: updatedList })
            enabledNext(true)
            toast.success(`Added ${newSkills.length} suggested skills!`)
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error suggesting skills:', error)
            }
            toast.error("Failed to suggest skills")
        } finally {
            setAiLoading(false)
        }
    }

    const onSave = async () => {
        setLoading(true)
        try {
            await GlobalApi.UpdateResumeDetail(params.resumeId as string, {
                content: { ...resumeInfo, skills: skillsList }
            })
            enabledNext(true)
            toast.success("Skills saved successfully!")
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error saving skills:', error)
            }
            toast.error("Failed to save skills")
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSkill()
        }
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-lg'>Skills</h2>
                    <p className='text-sm text-muted-foreground'>Add your professional skills</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={suggestSkills}
                    disabled={aiLoading}
                    className="flex gap-2"
                >
                    {aiLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                        <Sparkles className='h-4 w-4' />
                    )}
                    Suggest Skills
                </Button>
            </div>

            <div className='mt-5'>
                <div className='flex gap-2'>
                    <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a skill and press Enter (e.g., JavaScript)"
                        className='flex-1'
                    />
                    <Button onClick={addSkill} variant="outline">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {skillsList.length > 0 && (
                    <div className='mt-5 space-y-3'>
                        {skillsList.map((skill) => (
                            <div key={skill.id} className='flex items-center gap-3 p-3 border rounded-lg'>
                                <span className='flex-1 font-medium'>{skill.name}</span>
                                <input
                                    type="range"
                                    min="20"
                                    max="100"
                                    value={skill.rating}
                                    onChange={(e) => updateRating(skill.id, parseInt(e.target.value))}
                                    className='w-24 accent-primary'
                                />
                                <span className='text-sm text-muted-foreground w-10'>
                                    {skill.rating}%
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSkill(skill.id)}
                                    className="text-destructive hover:text-destructive h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {skillsList.length === 0 && (
                    <div className='mt-5 p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground'>
                        <p>No skills added yet</p>
                        <p className='text-sm'>Add skills manually or use AI to suggest relevant skills</p>
                    </div>
                )}
            </div>

            <div className='flex justify-end mt-5'>
                <Button onClick={onSave} disabled={loading}>
                    {loading ? <Loader2 className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    )
}

export default Skills
