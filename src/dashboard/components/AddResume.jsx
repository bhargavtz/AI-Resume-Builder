import { Loader2, PlusSquare } from 'lucide-react'
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
import GlobalApi from './../../../service/GlobalApi'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'



function AddResume() {

    const [openDialog,setOpenDialog]=useState(false)
    const [resumeTitle,setResumeTitle]=useState();
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
    const navigation=useNavigate();
    const onCreate=async()=>{
        setLoading(true)
        console.log("Attempting to create resume with title:", resumeTitle);
        const data={
            title:resumeTitle,
            userId:user?.primaryEmailAddress?.emailAddress, // Using user email as userId
            content:{} // Initial empty content for the resume
        }

        GlobalApi.CreateNewResume(data).then(resp=>{
            console.log("Resume creation successful. Full response:", resp);
            console.log("Response data:", resp.data);

            let resumeId;
            if (Array.isArray(resp.data) && resp.data.length > 0) {
                resumeId = resp.data[0]._id;
                console.log("New resume ID (from array):", resumeId);
            } else if (resp.data && resp.data._id) {
                resumeId = resp.data._id;
                console.log("New resume ID (from object):", resumeId);
            } else {
                console.error("Could not find resume ID in response:", resp.data);
                setLoading(false);
                return; // Stop execution if ID is not found
            }

            setLoading(false);
            navigation('/dashboard/resume/'+resumeId+"/edit");

        }).catch((error)=>{
            console.error("Error creating resume:", error);
            setLoading(false);
        })

    }
  return (
    <div >
        <div className='p-14 py-24 border 
        items-center flex 
        justify-center bg-secondary
        rounded-lg h-[280px]
        hover:scale-105 transition-all hover:shadow-md
        cursor-pointer border-dashed'
        onClick={()=>setOpenDialog(true)}
        >
            <PlusSquare  />
        </div>

        <Dialog open={openDialog}>
       
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
                <p>Add a title for your new resume</p>
                <Input className="my-2" 
                placeholder="Ex.Full Stack resume"
                onChange={(e)=>setResumeTitle(e.target.value)}
                />
            </DialogDescription>
            <div className='flex justify-end gap-5'>
                <Button onClick={()=>setOpenDialog(false)} variant="ghost">Cancel</Button>
                <Button 
                    disabled={!resumeTitle||loading}
                onClick={()=>onCreate()}>
                    {loading?
                    <Loader2 className='animate-spin' /> :'Create'   
                }
                    </Button>
            </div>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddResume
