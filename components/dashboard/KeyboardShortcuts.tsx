"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Command, X } from "lucide-react"
import { useEffect, useState } from "react"

interface Shortcut {
    keys: string[]
    description: string
    action: string
}

const shortcuts: Shortcut[] = [
    { keys: ["Ctrl", "N"], description: "Create new resume", action: "new" },
    { keys: ["Ctrl", "K"], description: "Search resumes", action: "search" },
    { keys: ["Ctrl", "F"], description: "Open filters", action: "filter" },
    { keys: ["Ctrl", "/"], description: "Show shortcuts", action: "help" },
    { keys: ["Delete"], description: "Delete selected", action: "delete" },
    { keys: ["Ctrl", "E"], description: "Export resume", action: "export" },
    { keys: ["Esc"], description: "Close modal", action: "close" },
]

interface KeyboardShortcutsProps {
    onAction: (action: string) => void
}

export function KeyboardShortcuts({ onAction }: KeyboardShortcutsProps) {
    const [showHelp, setShowHelp] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Show help modal
            if (e.ctrlKey && e.key === "/") {
                e.preventDefault()
                setShowHelp(true)
                return
            }

            // Close help modal
            if (e.key === "Escape" && showHelp) {
                setShowHelp(false)
                return
            }

            // New resume
            if (e.ctrlKey && e.key === "n") {
                e.preventDefault()
                onAction("new")
                return
            }

            // Search
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault()
                onAction("search")
                return
            }

            // Filter
            if (e.ctrlKey && e.key === "f") {
                e.preventDefault()
                onAction("filter")
                return
            }

            // Export
            if (e.ctrlKey && e.key === "e") {
                e.preventDefault()
                onAction("export")
                return
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onAction, showHelp])

    return (
        <>
            {/* Help Button */}
            <motion.button
                onClick={() => setShowHelp(true)}
                className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all z-40"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Keyboard Shortcuts (Ctrl + /)"
            >
                <Command className="h-5 w-5" />
            </motion.button>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowHelp(false)}
                        />

                        {/* Modal */}
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <motion.div
                                className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl shadow-2xl"
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
                                            <Command className="h-5 w-5 text-primary" />
                                            Keyboard Shortcuts
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Power user features
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowHelp(false)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="relative p-6 space-y-2 max-h-96 overflow-y-auto">
                                    {shortcuts.map((shortcut, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <span className="text-sm text-foreground">{shortcut.description}</span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, i) => (
                                                    <span key={i} className="flex items-center gap-1">
                                                        <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-white/10 border border-white/20 rounded shadow-sm">
                                                            {key}
                                                        </kbd>
                                                        {i < shortcut.keys.length - 1 && (
                                                            <span className="text-muted-foreground">+</span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
