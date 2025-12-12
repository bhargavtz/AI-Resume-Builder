"use client"

import { motion } from "framer-motion"
import { FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

const templates = [
    { id: 1, name: "Modern", color: "from-blue-500 to-cyan-500", preview: "modern" },
    { id: 2, name: "Classic", color: "from-purple-500 to-pink-500", preview: "classic" },
    { id: 3, name: "Creative", color: "from-orange-500 to-red-500", preview: "creative" },
    { id: 4, name: "Minimal", color: "from-green-500 to-teal-500", preview: "minimal" },
    { id: 5, name: "Professional", color: "from-indigo-500 to-blue-500", preview: "professional" },
]

export function TemplatesGallery() {
    const scrollRef = useRef<HTMLDivElement>(null)

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />

            <div className="relative space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-accent" />
                            Popular Templates
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Choose from our professionally designed templates
                        </p>
                    </div>
                    <Link
                        href="/templates"
                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                        View All →
                    </Link>
                </div>

                {/* Templates Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {templates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            className="group relative flex-shrink-0 w-40 snap-start"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <Link href={`/templates?template=${template.preview}`}>
                                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                                    {/* Template Preview */}
                                    <div className={`aspect-[8.5/11] bg-gradient-to-br ${template.color} p-4 relative overflow-hidden`}>
                                        {/* Simulated Document */}
                                        <div className="absolute inset-4 bg-white/90 rounded-lg p-3 space-y-2">
                                            <div className="h-2 w-3/4 rounded bg-gray-800/20" />
                                            <div className="h-1.5 w-1/2 rounded bg-gray-600/20" />
                                            <div className="mt-3 space-y-1">
                                                <div className="h-1 w-full rounded bg-gray-400/20" />
                                                <div className="h-1 w-5/6 rounded bg-gray-400/20" />
                                                <div className="h-1 w-4/6 rounded bg-gray-400/20" />
                                            </div>
                                        </div>

                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </div>

                                    {/* Template Name */}
                                    <div className="p-3 text-center">
                                        <p className="font-medium text-sm text-foreground">{template.name}</p>
                                    </div>

                                    {/* Use Template Button (appears on hover) */}
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                                            Use Template
                                        </button>
                                    </motion.div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
