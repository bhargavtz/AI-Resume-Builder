"use client"

import { motion } from "framer-motion"
import { Filter, Grid3x3, List, SortAsc } from "lucide-react"
import { useState } from "react"

export type FilterType = "all" | "favorites" | "drafts" | "completed"
export type SortType = "recent" | "alphabetical" | "created"
export type ViewType = "grid" | "list"

interface AdvancedFilterBarProps {
    onFilterChange: (filter: FilterType) => void
    onSortChange: (sort: SortType) => void
    onViewChange: (view: ViewType) => void
}

export function AdvancedFilterBar({ onFilterChange, onSortChange, onViewChange }: AdvancedFilterBarProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all")
    const [activeSort, setActiveSort] = useState<SortType>("recent")
    const [activeView, setActiveView] = useState<ViewType>("grid")

    const filters: { value: FilterType; label: string }[] = [
        { value: "all", label: "All" },
        { value: "favorites", label: "Favorites" },
        { value: "drafts", label: "Drafts" },
        { value: "completed", label: "Completed" },
    ]

    const sorts: { value: SortType; label: string }[] = [
        { value: "recent", label: "Recently Updated" },
        { value: "alphabetical", label: "Alphabetical" },
        { value: "created", label: "Date Created" },
    ]

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter)
        onFilterChange(filter)
    }

    const handleSortChange = (sort: SortType) => {
        setActiveSort(sort)
        onSortChange(sort)
    }

    const handleViewChange = (view: ViewType) => {
        setActiveView(view)
        onViewChange(view)
    }

    return (
        <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => handleFilterChange(filter.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeFilter === filter.value
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/10" />

            {/* Sort */}
            <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <select
                    value={activeSort}
                    onChange={(e) => handleSortChange(e.target.value as SortType)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 text-foreground border border-white/10 hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    {sorts.map((sort) => (
                        <option key={sort.value} value={sort.value}>
                            {sort.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
                <button
                    onClick={() => handleViewChange("grid")}
                    className={`p-2 rounded-md transition-all ${activeView === "grid"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    title="Grid View"
                >
                    <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleViewChange("list")}
                    className={`p-2 rounded-md transition-all ${activeView === "list"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    title="List View"
                >
                    <List className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    )
}
