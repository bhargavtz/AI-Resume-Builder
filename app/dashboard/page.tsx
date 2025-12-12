"use client"
import React, { useEffect, useState, useMemo } from 'react'
import AddResume from '@/components/AddResume'
import { useUser } from '@clerk/nextjs'
import ResumeItem from '@/components/ResumeItem'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Modal from '@/components/Modal'
import axios from 'axios'
import { motion, Variants } from 'framer-motion'
import { FileText, Plus, Sparkles, TrendingUp, Clock, Download, Zap, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { Resume } from '@/lib/types'
import { toast } from 'sonner'
import { EnhancedResumeCard } from '@/components/dashboard/EnhancedResumeCard'
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard'
import { TemplatesGallery } from '@/components/dashboard/TemplatesGallery'
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed'
import { AdvancedFilterBar, FilterType, SortType, ViewType } from '@/components/dashboard/AdvancedFilterBar'
import { ExportModal } from '@/components/dashboard/ExportModal'
import { KeyboardShortcuts } from '@/components/dashboard/KeyboardShortcuts'

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function Dashboard() {
    const { user, isLoaded } = useUser();
    const [resumeList, setResumeList] = useState<Resume[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [sortType, setSortType] = useState<SortType>("recent");
    const [viewType, setViewType] = useState<ViewType>("grid");
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

    useEffect(() => {
        if (user) {
            GetResumesList();
        }
    }, [user])

    const GetResumesList = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/resumes?limit=50');

            // Handle new standardized API response format
            if (res.data.success && res.data.data) {
                setResumeList(res.data.data.resumes || []);
            } else if (res.data.resumes) {
                // Fallback for old format
                setResumeList(res.data.resumes || []);
            } else if (Array.isArray(res.data)) {
                // Direct array response
                setResumeList(res.data);
            } else {
                setResumeList([]);
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e);
            }
            toast.error('Failed to load resumes. Please try again.');
            setResumeList([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }

    // Memoized filtered and sorted resumes
    const filteredResumes = useMemo(() => {
        // Ensure resumeList is an array
        if (!Array.isArray(resumeList)) {
            return [];
        }

        let filtered = resumeList.filter(resume =>
            resume.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Apply filter type
        if (filterType === "drafts") {
            filtered = filtered.filter(r => r.status === "draft");
        } else if (filterType === "completed") {
            filtered = filtered.filter(r => r.status === "complete");
        }
        // Note: favorites would need a favorites field in Resume type

        // Apply sorting with null checks
        if (sortType === "alphabetical") {
            filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } else if (sortType === "created") {
            filtered.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        } else {
            // recent (default)
            filtered.sort((a, b) => {
                const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return dateB - dateA;
            });
        }

        return filtered;
    }, [resumeList, searchQuery, filterType, sortType]);

    // Keyboard shortcut handler
    const handleShortcutAction = (action: string) => {
        switch (action) {
            case "new":
                setModalOpen(true);
                break;
            case "search":
                document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
                break;
            case "export":
                if (filteredResumes.length > 0) {
                    setSelectedResume(filteredResumes[0]);
                    setExportModalOpen(true);
                }
                break;
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <motion.div
                    className="mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        Welcome back, <span className="text-gradient">{user?.firstName || "there"}</span>! 👋
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your resumes and create new ones with AI.
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div
                        className="p-5 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                        variants={fadeInUp}
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Total</span>
                        </div>
                        <div className="text-3xl font-bold">{resumeList.length}</div>
                        <div className="text-xs text-muted-foreground">Resumes Created</div>
                    </motion.div>

                    <motion.div
                        className="p-5 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                        variants={fadeInUp}
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <span className="text-sm text-muted-foreground">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-green-500">{resumeList.filter(r => r.status !== 'archived').length}</div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                    </motion.div>

                    <motion.div
                        className="p-5 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                        variants={fadeInUp}
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-accent/10">
                                <Sparkles className="h-5 w-5 text-accent" />
                            </div>
                            <span className="text-sm text-muted-foreground">AI</span>
                        </div>
                        <div className="text-3xl font-bold text-accent">Gemini</div>
                        <div className="text-xs text-muted-foreground">Powered</div>
                    </motion.div>

                    <motion.div
                        className="p-5 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                        variants={fadeInUp}
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Zap className="h-5 w-5 text-blue-500" />
                            </div>
                            <span className="text-sm text-muted-foreground">Features</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-500">3</div>
                        <div className="text-xs text-muted-foreground">AI Tools</div>
                    </motion.div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="p-3 rounded-xl bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold">New Resume</div>
                            <div className="text-sm text-muted-foreground">Start from scratch</div>
                        </div>
                    </motion.button>

                    <Link href="/templates">
                        <motion.div
                            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                                <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">Browse Templates</div>
                                <div className="text-sm text-muted-foreground">Use a template</div>
                            </div>
                        </motion.div>
                    </Link>


                </motion.div>

                {/* Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <AnalyticsDashboard
                            resumeCount={resumeList.length}
                            activeCount={resumeList.filter(r => r.status !== 'archived').length}
                            totalDownloads={0}
                        />
                    </div>
                    <div>
                        <RecentActivityFeed resumes={resumeList} />
                    </div>
                </div>


                {/* Advanced Filter Bar */}
                <div className="mb-6">
                    <AdvancedFilterBar
                        onFilterChange={setFilterType}
                        onSortChange={setSortType}
                        onViewChange={setViewType}
                    />
                </div>

                {/* Search and Filter */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search resumes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </motion.div>

                {/* Resume Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <motion.div
                        className={`grid gap-6 ${viewType === "grid"
                            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            : "grid-cols-1"
                            }`}
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <AddResume />
                        </motion.div>
                        {filteredResumes.map((resume, idx) => (
                            <motion.div key={idx} variants={fadeInUp}>
                                <EnhancedResumeCard
                                    resume={resume}
                                    onDelete={async () => {
                                        // Confirm before deleting
                                        if (!confirm(`Are you sure you want to delete "${resume.title}"?`)) {
                                            return;
                                        }

                                        try {
                                            const resumeId = resume._id || (resume as any)._id;
                                            const response = await axios.delete(`/api/resumes/${resumeId}`);

                                            if (response.data.success) {
                                                toast.success("Resume deleted successfully!");
                                                GetResumesList();
                                            } else {
                                                toast.error("Failed to delete resume");
                                            }
                                        } catch (error) {
                                            console.error("Delete error:", error);
                                            toast.error("Failed to delete resume");
                                        }
                                    }}
                                    onFavorite={() => {
                                        // Handle favorite
                                        toast.success("Added to favorites!");
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && filteredResumes.length === 0 && resumeList.length === 0 && (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                            <Sparkles className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Create your first AI-powered resume to get started on your career journey
                        </p>
                        <motion.button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="h-5 w-5" />
                            Create Your First Resume
                        </motion.button>
                    </motion.div>
                )}

                {/* No Search Results */}
                {!isLoading && filteredResumes.length === 0 && resumeList.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No resumes found matching "{searchQuery}"</p>
                    </div>
                )}
            </main>

            {/* Create Resume Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Resume" size="lg">
                <AddResume />
            </Modal>

            {/* Export Modal */}
            <ExportModal
                isOpen={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                resumeTitle={selectedResume?.title}
            />

            {/* Keyboard Shortcuts */}
            <KeyboardShortcuts onAction={handleShortcutAction} />

            <Footer />
        </div>
    )
}

export default Dashboard
