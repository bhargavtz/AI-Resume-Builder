"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Download, FileJson, FileText, X } from "lucide-react"
import { useState } from "react"

interface ExportModalProps {
    isOpen: boolean
    onClose: () => void
    resumeTitle?: string
}

export function ExportModal({ isOpen, onClose, resumeTitle = "Resume" }: ExportModalProps) {
    const [selectedFormats, setSelectedFormats] = useState<string[]>(["pdf"])
    const [isExporting, setIsExporting] = useState(false)

    const formats = [
        { id: "pdf", name: "PDF", icon: FileText, description: "Best for printing and sharing" },
        { id: "docx", name: "DOCX", icon: FileText, description: "Editable Word document" },
        { id: "json", name: "JSON", icon: FileJson, description: "Data format for backup" },
        { id: "html", name: "HTML", icon: FileText, description: "Web-ready format" },
    ]

    const toggleFormat = (formatId: string) => {
        setSelectedFormats(prev =>
            prev.includes(formatId)
                ? prev.filter(id => id !== formatId)
                : [...prev, formatId]
        )
    }

    const handleExport = async () => {
        setIsExporting(true)
        // Simulate export
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsExporting(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                        >
                            {/* Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

                            {/* Header */}
                            <div className="relative flex items-center justify-between p-6 border-b border-white/10">
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                        <Download className="h-5 w-5 text-primary" />
                                        Export Resume
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {resumeTitle}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="h-5 w-5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="relative p-6 space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Select the formats you want to export:
                                </p>

                                {/* Format Options */}
                                <div className="space-y-2">
                                    {formats.map((format) => {
                                        const Icon = format.icon
                                        const isSelected = selectedFormats.includes(format.id)

                                        return (
                                            <motion.button
                                                key={format.id}
                                                onClick={() => toggleFormat(format.id)}
                                                className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all ${isSelected
                                                        ? "border-primary bg-primary/10"
                                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/20" : "bg-white/10"
                                                    }`}>
                                                    <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"
                                                        }`} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-foreground">{format.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {format.description}
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                                        ? "border-primary bg-primary"
                                                        : "border-white/20"
                                                    }`}>
                                                    {isSelected && (
                                                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                                    )}
                                                </div>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="relative flex items-center justify-end gap-3 p-6 border-t border-white/10">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition-colors"
                                    disabled={isExporting}
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    onClick={handleExport}
                                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    disabled={selectedFormats.length === 0 || isExporting}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isExporting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" />
                                            Export ({selectedFormats.length})
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
