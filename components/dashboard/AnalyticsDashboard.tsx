"use client"

import { motion } from "framer-motion"
import { Activity, Download, FileText, TrendingUp } from "lucide-react"
import { useMemo } from "react"

interface AnalyticsDashboardProps {
    resumeCount: number
    activeCount: number
    totalDownloads?: number
}

export function AnalyticsDashboard({ resumeCount, activeCount, totalDownloads = 0 }: AnalyticsDashboardProps) {
    // Generate activity heatmap data (last 12 weeks)
    const heatmapData = useMemo(() => {
        const weeks = 12
        const days = 7
        return Array.from({ length: weeks }, (_, weekIndex) =>
            Array.from({ length: days }, (_, dayIndex) => ({
                week: weekIndex,
                day: dayIndex,
                count: Math.floor(Math.random() * 5), // Random activity for demo
            }))
        ).flat()
    }, [])

    const getHeatmapColor = (count: number) => {
        if (count === 0) return "bg-muted/20"
        if (count === 1) return "bg-primary/20"
        if (count === 2) return "bg-primary/40"
        if (count === 3) return "bg-primary/60"
        return "bg-primary/80"
    }

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

            <div className="relative space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Your Activity
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Resume creation activity over the last 12 weeks
                        </p>
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div className="space-y-2">
                    <div className="flex gap-1">
                        {Array.from({ length: 12 }, (_, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-1">
                                {Array.from({ length: 7 }, (_, dayIndex) => {
                                    const data = heatmapData.find(
                                        d => d.week === weekIndex && d.day === dayIndex
                                    )
                                    return (
                                        <motion.div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className={`w-3 h-3 rounded-sm ${getHeatmapColor(data?.count || 0)} transition-colors`}
                                            whileHover={{ scale: 1.5 }}
                                            title={`${data?.count || 0} resumes`}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Less</span>
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-sm ${getHeatmapColor(i)}`}
                                />
                            ))}
                        </div>
                        <span>More</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{resumeCount}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total Resumes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{activeCount}</div>
                        <div className="text-xs text-muted-foreground mt-1">Active</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{totalDownloads}</div>
                        <div className="text-xs text-muted-foreground mt-1">Downloads</div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
