"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Loader2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import GlobalApi from '@/service/GlobalApi'
import { toast } from 'sonner'
import { PersonalDetails } from '@/lib/types'

function PersonalDetail({ enabledNext }: { enabledNext: (v: boolean) => void }) {
    const params = useParams()
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

    const [formData, setFormData] = useState<PersonalDetails>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Initialize formData with resumeInfo.personalDetails when it loads
        if (resumeInfo?.personalDetails) {
            setFormData(resumeInfo.personalDetails)

            // Enable Next button if all required fields are filled
            const pd = resumeInfo.personalDetails
            const hasAllRequiredFields =
                pd.firstName &&
                pd.lastName &&
                pd.jobTitle &&
                pd.address &&
                pd.phone &&
                pd.email

            if (hasAllRequiredFields) {
                enabledNext(true)
            }
        }
    }, [resumeInfo])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        enabledNext(false)
        const { name, value } = e.target

        const updatedFormData = {
            ...formData,
            [name]: value
        }
        setFormData(updatedFormData)

        setResumeInfo({
            ...resumeInfo,
            personalDetails: updatedFormData
        })
    }

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToUpdate = {
                content: {
                    ...resumeInfo,
                    personalDetails: formData
                }
            }

            await GlobalApi.UpdateResumeDetail(params.resumeId as string, dataToUpdate)

            enabledNext(true)
            toast.success("Details updated successfully!")
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error saving resume:', error)
            }
            toast.error("Failed to update details.")
        } finally {
            setLoading(false)
        }
    }

    // Helper to get personal detail value
    const getValue = (field: keyof PersonalDetails) => {
        return formData?.[field] || resumeInfo?.personalDetails?.[field] || ''
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p className='text-sm text-muted-foreground'>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    <div>
                        <label className='text-sm'>First Name</label>
                        <Input
                            name="firstName"
                            defaultValue={getValue('firstName')}
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Last Name</label>
                        <Input
                            name="lastName"
                            required
                            onChange={handleInputChange}
                            defaultValue={getValue('lastName')}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Job Title</label>
                        <Input
                            name="jobTitle"
                            required
                            defaultValue={getValue('jobTitle')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Address</label>
                        <Input
                            name="address"
                            required
                            defaultValue={getValue('address')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Phone</label>
                        <Input
                            name="phone"
                            required
                            defaultValue={getValue('phone')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Email</label>
                        <Input
                            name="email"
                            type="email"
                            required
                            defaultValue={getValue('email')}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PersonalDetail
