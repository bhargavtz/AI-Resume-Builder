"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { UserButton, useUser, SignInButton } from '@clerk/nextjs'
import { FileText } from 'lucide-react'

function Header() {
    const { isSignedIn } = useUser();

    return (
        <div className='p-3 px-5 flex justify-between shadow-md bg-white dark:bg-gray-900 border-b dark:border-gray-800'>
            <div className='flex items-center gap-2'>
                <div className="bg-primary p-2 rounded-lg">
                    <FileText className="text-white w-6 h-6" />
                </div>
                <h1 className='font-bold text-xl'>AI Resume</h1>
            </div>

            <div className='flex gap-2 items-center'>
                {isSignedIn ? (
                    <div className='flex items-center gap-4'>
                        <Link href={'/dashboard'}>
                            <Button variant="outline">Dashboard</Button>
                        </Link>
                        <UserButton />
                    </div>
                ) : (
                    <SignInButton mode="modal">
                        <Button>Get Started</Button>
                    </SignInButton>
                )}
            </div>
        </div>
    )
}

export default Header
