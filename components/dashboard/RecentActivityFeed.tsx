"use client"

import { motion } from "framer-motion"
import { Clock, Download, Edit, FileText, Plus, Sparkles } from "lucide-react"
import { Resume } from "@/lib/types"
import { useMemo } from "react"

interface Activity {
    id: string
    type: "created" | "edited" | "downloaded"
    resumeTitle: string
    timestamp: Date
}

interface RecentActivityFeedProps {
    resumes: Resume[]
}

export function RecentActivityFeed({ resumes }: RecentActivityFeedProps) {
    // Generate activities from resume data
    const activities = useMemo(() => {
        const acts: Activity[] = []

        // Sort resumes by update time
        const sortedResumes = [...resumes].sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )

        // Take top 5 most recent
        sortedResumes.slice(0, 5).forEach((resume, index) => {
            const createdTime = new Date(resume.createdAt || resume.updatedAt).getTime()
            const updatedTime = new Date(resume.updatedAt).getTime()

            // If created and updated are very close, show only created
            if (Math.abs(updatedTime - createdTime) < 5000) {
                acts.push({
                    id: `${resume._id || (resume as any)._id || index}-created`,
                    type: "created",
                    resumeTitle: resume.title || "Untitled Resume",
                    timestamp: new Date(resume.createdAt || resume.updatedAt)
                })
            } else {
                // Show edited activity
                acts.push({
                    id: `${resume._id || (resume as any)._id || index}-edited`,
                    type: "edited",
                    resumeTitle: resume.title || "Untitled Resume",
                    timestamp: new Date(resume.updatedAt)
                })
            }
        })

        return acts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }, [resumes])
    const getActivityIcon = (type: Activity["type"]) => {
        switch (type) {
            case "created":
                return <Plus className="h-4 w-4 text-green-400" />
            case "edited":
                return <Edit className="h-4 w-4 text-blue-400" />
            case "downloaded":
                return <Download className="h-4 w-4 text-purple-400" />
        }
    }

    const getActivityText = (type: Activity["type"]) => {
        switch (type) {
            case "created":
                return "Created"
            case "edited":
                return "Edited"
            case "downloaded":
                return "Downloaded"
        }
    }

    const getRelativeTime = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
        if (seconds < 60) return "just now"
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-transparent to-blue/5" />

            <div className="relative space-y-4">
                {/* Header */}
                <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Activity
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your latest resume actions
                    </p>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-3">
                    {activities.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">No activity yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Create your first resume to see activity</p>
                        </div>
                    ) : (
                        activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ x: 4 }}
                            >
                                {/* Icon */}
                                <div className="shrink-0 p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
                                    {getActivityIcon(activity.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {getActivityText(activity.type)} "{activity.resumeTitle}"
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {getRelativeTime(activity.timestamp)}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* View All Link */}
                <button className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                    View All Activity →
                </button>
            </div>
        </motion.div>
    )
}
