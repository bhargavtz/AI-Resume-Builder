"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";
import { HiUser, HiMail, HiCalendar, HiDocumentText, HiSparkles, HiCog } from "react-icons/hi";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
    const { user, isLoaded } = useUser();
    const [resumeCount, setResumeCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchResumeCount();
        }
    }, [user]);

    const fetchResumeCount = async () => {
        try {
            const res = await axios.get("/api/resumes");
            setResumeCount(res.data.length);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="relative mb-8">
                    {/* Background gradient */}
                    <div className="absolute inset-0 h-32 rounded-2xl gradient-primary opacity-80 -z-10" />

                    <div className="pt-16 px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                            {/* Avatar */}
                            <div className="relative -mt-12">
                                {user?.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full border-4 border-background shadow-lg object-cover"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-full border-4 border-background shadow-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                                        {user?.firstName?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>

                            {/* Name and Actions */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-foreground">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <p className="text-muted-foreground">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>

                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:bg-muted transition-colors text-sm font-medium"
                            >
                                <HiDocumentText className="h-4 w-4" />
                                View Resumes
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <HiDocumentText className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-muted-foreground text-sm">Resumes Created</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">
                            {isLoading ? "..." : resumeCount}
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-accent/10">
                                <HiSparkles className="h-5 w-5 text-accent" />
                            </div>
                            <span className="text-muted-foreground text-sm">AI Generations</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">∞</div>
                    </div>

                    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <HiCalendar className="h-5 w-5 text-green-500" />
                            </div>
                            <span className="text-muted-foreground text-sm">Member Since</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                })
                                : "N/A"}
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Profile Information</h2>
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <HiCog className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="divide-y divide-border">
                        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                                <HiUser className="h-4 w-4" />
                                <span className="text-sm">Full Name</span>
                            </div>
                            <div className="font-medium">
                                {user?.firstName} {user?.lastName}
                            </div>
                        </div>

                        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                                <HiMail className="h-4 w-4" />
                                <span className="text-sm">Email</span>
                            </div>
                            <div className="font-medium">
                                {user?.primaryEmailAddress?.emailAddress}
                            </div>
                        </div>

                        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground min-w-[140px]">
                                <HiCalendar className="h-4 w-4" />
                                <span className="text-sm">Created</span>
                            </div>
                            <div className="font-medium">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 p-6 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all text-sm"
                        >
                            <HiDocumentText className="h-4 w-4" />
                            Create New Resume
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm font-medium"
                        >
                            View All Resumes
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
