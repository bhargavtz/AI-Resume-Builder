"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Download, Edit, FileText, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Resume } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EnhancedResumeCardProps {
    resume: Resume
    onDelete?: () => void
    onFavorite?: () => void
}

export function EnhancedResumeCard({ resume, onDelete, onFavorite }: EnhancedResumeCardProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [showActions, setShowActions] = useState(false)

    const handleFavorite = () => {
        setIsFavorite(!isFavorite)
        onFavorite?.()
    }

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Glassmorphism Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:shadow-primary/20">

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                {/* Resume Preview Thumbnail */}
                <Link href={`/dashboard/resume/${resume._id || (resume as any)._id}/edit`}>
                    <div className="relative aspect-[8.5/11] overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 p-6">
                        {/* Simulated Resume Preview */}
                        <div className="space-y-2">
                            <div className="h-3 w-3/4 rounded bg-foreground/20" />
                            <div className="h-2 w-1/2 rounded bg-foreground/10" />
                            <div className="mt-4 space-y-1">
                                <div className="h-2 w-full rounded bg-foreground/5" />
                                <div className="h-2 w-5/6 rounded bg-foreground/5" />
                                <div className="h-2 w-4/6 rounded bg-foreground/5" />
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                            <span className={cn(
                                "rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm",
                                resume.status === "complete"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            )}>
                                {resume.status === "complete" ? "Complete" : "Draft"}
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Card Content */}
                <div className="relative p-4 space-y-3">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-2">
                        <Link href={`/dashboard/resume/${resume._id || (resume as any)._id}/edit`}>
                            <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                                {resume.title || "Untitled Resume"}
                            </h3>
                        </Link>

                        {/* Favorite Button */}
                        <button
                            onClick={handleFavorite}
                            className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <Star className={cn(
                                "h-4 w-4 transition-all",
                                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            )} />
                        </button>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>Modern</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link
                            href={`/dashboard/resume/${resume._id || (resume as any)._id}/edit`}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
                        >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                        </Link>
                        <button
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                            title="Download"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </motion.div>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
            </div>
        </motion.div>
    )
}
