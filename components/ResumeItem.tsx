"use client";
import { Notebook, MoreVertical, Edit, Trash2, Copy, Download, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Resume } from '@/lib/types';

interface ResumeItemProps {
    resume: Pick<Resume, '_id' | 'title' | 'content' | 'themeColor' | 'updatedAt'>;
    refreshData?: () => Promise<void>;
}

function ResumeItem({ resume, refreshData }: ResumeItemProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`/api/resumes/${resume._id}`);
            toast.success("Resume deleted successfully!");
            setDeleteDialogOpen(false);
            if (refreshData) {
                await refreshData();
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error deleting resume:", error);
            }
            toast.error("Failed to delete resume");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async () => {
        try {
            setIsDuplicating(true);
            const response = await axios.post('/api/resumes', {
                title: `${resume.title} (Copy)`,
            });

            // Copy the content from the original resume
            if (resume.content) {
                await axios.put(`/api/resumes/${response.data._id}`, {
                    content: resume.content,
                    themeColor: resume.themeColor,
                });
            }

            toast.success("Resume duplicated successfully!");
            if (refreshData) {
                await refreshData();
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error("Error duplicating resume:", error);
            }
            toast.error("Failed to duplicate resume");
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleView = () => {
        router.push(`/dashboard/resume/${resume._id}/view`);
    };

    const handleDownload = () => {
        // Navigate to view page where PDF download functionality exists
        router.push(`/dashboard/resume/${resume._id}/view`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <>
            <div className='group relative p-14 bg-secondary flex flex-col items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary'>
                {/* Action Menu */}
                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/resume/${resume._id}/edit`} className="flex items-center cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleDuplicate}
                                disabled={isDuplicating}
                                className="cursor-pointer"
                            >
                                {isDuplicating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Copy className="mr-2 h-4 w-4" />
                                )}
                                Duplicate
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => setDeleteDialogOpen(true)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Resume Icon */}
                <Link href={`/dashboard/resume/${resume._id}/edit`} className="flex flex-col items-center justify-center flex-1 w-full">
                    <Notebook className="h-16 w-16 text-primary" />
                </Link>
            </div>

            {/* Resume Info */}
            <div className='text-center mt-2'>
                <div className='font-bold text-lg'>{resume.title}</div>
                {resume.updatedAt && (
                    <div className='text-xs text-muted-foreground mt-1'>
                        Modified {formatDate(resume.updatedAt)}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Resume</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{resume.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ResumeItem;
