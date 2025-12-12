"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export interface AnimatedTab {
    label: string
    href: string
}

export interface AnimatedTabsProps {
    tabs: AnimatedTab[]
}

export function AnimatedTabs({ tabs }: AnimatedTabsProps) {
    const [activeTab, setActiveTab] = useState(tabs[0].label)
    const [hoveredTab, setHoveredTab] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const activeTabRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        const container = containerRef.current

        if (container && activeTab) {
            const activeTabElement = activeTabRef.current

            if (activeTabElement) {
                const { offsetLeft, offsetWidth } = activeTabElement

                const clipLeft = offsetLeft + 16
                const clipRight = offsetLeft + offsetWidth + 16

                container.style.clipPath = `inset(0 ${Number(
                    100 - (clipRight / container.offsetWidth) * 100,
                ).toFixed()}% 0 ${Number(
                    (clipLeft / container.offsetWidth) * 100,
                ).toFixed()}% round 17px)`
            }
        }
    }, [activeTab])

    return (
        <div className="relative mx-auto flex w-fit flex-col items-center py-2 px-4">
            <div
                ref={containerRef}
                className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
            >
                <div className="relative flex w-full justify-center bg-primary/90 backdrop-blur-sm">
                    {tabs.map((tab, index) => (
                        <Link
                            key={index}
                            href={tab.href}
                            onClick={() => setActiveTab(tab.label)}
                            className="flex h-8 items-center rounded-full px-4 text-sm font-medium text-primary-foreground"
                            tabIndex={-1}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="relative flex w-full justify-center">
                {tabs.map(({ label, href }, index) => {
                    const isActive = activeTab === label
                    const isHovered = hoveredTab === label

                    return (
                        <Link
                            key={index}
                            href={href}
                            ref={isActive ? activeTabRef : null}
                            onClick={() => setActiveTab(label)}
                            onMouseEnter={() => setHoveredTab(label)}
                            onMouseLeave={() => setHoveredTab(null)}
                            className="relative flex h-8 items-center cursor-pointer rounded-full px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <motion.span
                                className="relative z-10"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {label}
                            </motion.span>

                            {/* Active tab glow effect */}
                            {isActive && (
                                <span className="absolute inset-0 blur-md bg-primary/30 -z-10 animate-pulse-glow rounded-full" />
                            )}

                            {/* Bottom line hover effect - only on hover, not active */}
                            {isHovered && !isActive && (
                                <motion.div
                                    className="absolute bottom-2 left-0 right-0 h-0.5 bg-primary/60"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    exit={{ scaleX: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25
                                    }}
                                />
                            )}

                            {/* Bottom line for active tab */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab-indicator"
                                    className="absolute bottom-1 left-0 right-0 h-0.5 bg-primary"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
