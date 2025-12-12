"use client"
import { PlusSquare, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false)
    const [resumeTitle, setResumeTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const onCreate = async () => {
        setLoading(true)
        try {
            const resp = await axios.post('/api/resumes', { title: resumeTitle });
            if (resp.data.success) {
                setLoading(false);
                setOpenDialog(false);
                router.push('/dashboard/resume/' + resp.data.data._id + "/edit");
            } else {
                // Fallback for non-standard response or error provided in success
                setLoading(false);
                toast.error('Failed to create resume');
            }
        } catch (e) {
            setLoading(false);
            toast.error('Failed to create resume. Please try again.');
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <div className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'>
                    <PlusSquare />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Resume</DialogTitle>
                    <DialogDescription>
                        Add a title for your new resume
                    </DialogDescription>
                    <Input className='my-2' placeholder="Ex. Full Stack Resume" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResumeTitle(e.target.value)} />
                    <div className='flex justify-end gap-5'>
                        <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
                        <Button disabled={!resumeTitle || loading} onClick={onCreate}>
                            {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
export default AddResume
