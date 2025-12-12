"use client";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { HiSparkles, HiMenu, HiX } from "react-icons/hi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { AnimatedTabs } from "./ui/animated-tabs";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const { isSignedIn } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showFloatingCTA, setShowFloatingCTA] = useState(false);

    useEffect(() => {
        let ticking = false;

        const updateScrollState = () => {
            const scrollY = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            // Update scroll state
            setIsScrolled(scrollY > 10);

            // Update scroll progress
            const progress = (scrollY / (scrollHeight - clientHeight)) * 100;
            setScrollProgress(Math.min(progress, 100));

            // Show floating CTA after scrolling 300px
            setShowFloatingCTA(scrollY > 300);

            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial update
        updateScrollState();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            isScrolled
                ? "bg-background/95 backdrop-blur-xl shadow-lg"
                : "bg-transparent backdrop-blur-md"
        )}>
            {/* Scroll Progress Indicator */}
            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                            <HiSparkles className="h-6 w-6 text-primary transition-transform duration-500 group-hover:rotate-180" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            AI Resume<span className="text-primary">Builder</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <AnimatedTabs
                            tabs={[
                                { label: "Templates", href: "/templates" },
                                { label: "Pricing", href: "/pricing" },
                                { label: "Features", href: "/#features" },
                                ...(isSignedIn ? [
                                    { label: "AI Tools", href: "/ai-tools" },
                                    { label: "Dashboard", href: "/dashboard" }
                                ] : [])
                            ]}
                        />

                        {/* Floating CTA Button */}
                        <AnimatePresence>
                            {showFloatingCTA && !isSignedIn && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SignInButton mode="modal">
                                        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                                            Get Started
                                        </button>
                                    </SignInButton>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isSignedIn ? (
                            <>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-9 w-9",
                                        },
                                    }}
                                />
                                <ThemeToggle />
                            </>
                        ) : !showFloatingCTA && (
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25">
                                    Get Started
                                </button>
                            </SignInButton>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <HiX className="h-6 w-6" />
                        ) : (
                            <HiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/30 animate-in slide-in-from-top-2">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/templates"
                                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Templates
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/#features"
                                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Features
                            </Link>
                            {isSignedIn ? (
                                <>
                                    <Link
                                        href="/ai-tools"
                                        className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        AI Tools
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="px-2">
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                    <div className="px-2 pt-2">
                                        <ThemeToggle />
                                    </div>
                                </>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="w-full px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
                                        Get Started
                                    </button>
                                </SignInButton>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
