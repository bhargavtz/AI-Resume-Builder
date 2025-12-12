"use client";
import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ArrowRight, CheckCircle2, Wand2, Sparkles, FileText, Download, Zap, Users, Star, Rocket, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { motion, Variants, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";

// Animation variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

// Testimonials data
const testimonials = [
    {
        text: "The AI resume builder saved me hours of work. Got 3 interviews in the first week!",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        name: "Alex Johnson",
        role: "Software Engineer",
    },
    {
        text: "Beautiful templates and the AI suggestions were spot-on. Highly recommended!",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        name: "Sarah Chen",
        role: "Marketing Manager",
    },
    {
        text: "Finally passed ATS filters at top tech companies. This tool is a game-changer.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        name: "Michael Brown",
        role: "Data Analyst",
    },
    {
        text: "The AI-powered content suggestions helped me articulate my experience perfectly.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        name: "Emily Rodriguez",
        role: "Product Manager",
    },
    {
        text: "I landed my dream job within 2 weeks of using this resume builder. Amazing!",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        name: "David Kim",
        role: "UX Designer",
    },
    {
        text: "The real-time preview and export quality are outstanding. Worth every penny!",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        name: "Jessica Taylor",
        role: "Business Analyst",
    },
    {
        text: "As a career changer, the AI helped me highlight transferable skills brilliantly.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        name: "Ryan Martinez",
        role: "Project Manager",
    },
    {
        text: "The templates are modern and professional. Recruiters complimented my resume!",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        name: "Olivia Anderson",
        role: "HR Specialist",
    },
    {
        text: "Saved me from writer's block. The AI suggestions were exactly what I needed.",
        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
        name: "James Wilson",
        role: "Sales Executive",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// Infinite Grid Hero Component
const InfiniteGridHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const gridOffsetX = useMotionValue(0);
    const gridOffsetY = useMotionValue(0);

    const speedX = 0.5;
    const speedY = 0.5;

    useAnimationFrame(() => {
        const currentX = gridOffsetX.get();
        const currentY = gridOffsetY.get();
        gridOffsetX.set((currentX + speedX) % 40);
        gridOffsetY.set((currentY + speedY) % 40);
    });

    const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
        >
            {/* Base Grid Layer */}
            <div className="absolute inset-0 z-0 opacity-[0.05]">
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
            </div>

            {/* Mouse-following Spotlight Grid */}
            <motion.div
                className="absolute inset-0 z-0 opacity-40"
                style={{ maskImage, WebkitMaskImage: maskImage }}
            >
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
            </motion.div>

            {/* Gradient Blobs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/40 dark:bg-orange-600/20 blur-[120px]" />
                <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/30 blur-[100px]" />
                <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/40 dark:bg-blue-600/20 blur-[120px]" />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                {/* Badge */}
                <motion.div
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
                    variants={fadeInUp}
                >
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Powered by Gemini 2.0 Flash
                </motion.div>

                {/* Heading */}
                <motion.div className="space-y-4" variants={fadeInUp}>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                        Build Your Professional <br />
                        <span className="text-gradient">Resume with AI</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Create a standout resume in minutes. Our AI-powered builder helps you craft professional, ATS-friendly resumes that get you hired.
                    </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div className="flex gap-4 flex-wrap justify-center" variants={fadeInUp}>
                    <Link href="/dashboard">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" className="gap-2 text-lg h-14 px-8 rounded-full gradient-primary border-0 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                                Build My Resume <ArrowRight className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </Link>
                    <Link href="#features">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2 hover:bg-muted transition-all">
                                Learn More
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="flex flex-wrap justify-center gap-8 pt-8"
                    variants={fadeInUp}
                >
                    {[
                        { value: "10K+", label: "Resumes Created" },
                        { value: "95%", label: "Success Rate" },
                        { value: "4.9", label: "User Rating" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            className="text-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

// Grid Pattern Component
const GridPattern = ({ offsetX, offsetY }: { offsetX: any; offsetY: any }) => {
    return (
        <svg className="w-full h-full">
            <defs>
                <motion.pattern
                    id="grid-pattern"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                    x={offsetX}
                    y={offsetY}
                >
                    <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-muted-foreground"
                    />
                </motion.pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
    );
};


export default function Home() {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section - Infinite Grid */}
            <InfiniteGridHero />

            {/* How It Works Section */}
            <section className="py-24 bg-muted/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-4">
                            <Rocket className="h-4 w-4" />
                            How It Works
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Three Simple <span className="text-gradient">Steps</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Create your professional resume in just a few minutes.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {[
                            { step: "01", icon: FileText, title: "Enter Your Details", desc: "Fill in your basic information, experience, and skills." },
                            { step: "02", icon: Wand2, title: "AI Enhances Content", desc: "Our AI optimizes your content for ATS systems and recruiters." },
                            { step: "03", icon: Download, title: "Download & Apply", desc: "Export your polished resume and start applying to jobs." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="relative p-8 rounded-2xl border border-border bg-card text-center group hover:shadow-xl transition-shadow"
                                variants={scaleIn}
                                whileHover={{ y: -5 }}
                            >
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                    {item.step}
                                </div>
                                <div className="h-16 w-16 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-4">
                            <Zap className="h-4 w-4" />
                            Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Why Choose <span className="text-gradient">AI Resume Builder</span>?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to create a job-winning resume in minutes.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {[
                            { icon: Wand2, title: "AI-Powered Writing", desc: "Let AI generate professional summaries and bullet points aligned with your job title." },
                            { icon: Shield, title: "ATS Optimized", desc: "Templates designed to be easily read by Applicant Tracking Systems." },
                            { icon: Sparkles, title: "Real-time Preview", desc: "See changes instantly as you edit your resume content." },
                            { icon: Download, title: "One-Click Export", desc: "Export your resume to PDF with perfect formatting." },
                            { icon: Clock, title: "Save Time", desc: "Create a professional resume in under 10 minutes." },
                            { icon: Users, title: "Multiple Templates", desc: "Choose from a variety of modern, professional templates." },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className="group p-6 rounded-2xl border border-border bg-card hover:bg-card/80 transition-all duration-300"
                                variants={scaleIn}
                                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
                            >
                                <motion.div
                                    className="h-14 w-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <feature.icon className="text-primary w-7 h-7" />
                                </motion.div>
                                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-muted/30 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-4">
                            <Users className="h-4 w-4" />
                            Testimonials
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Loved by <span className="text-gradient">Job Seekers</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            See what our users have to say about their experience.
                        </p>
                    </motion.div>

                    <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
                        <TestimonialsColumn testimonials={firstColumn} duration={15} />
                        <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                        <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-90 -z-10" />
                <motion.div
                    className="absolute inset-0 -z-10"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    style={{
                        backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')"
                    }}
                />

                <motion.div
                    className="container mx-auto px-4 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Build Your Dream Resume?
                    </h2>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                        Join thousands of job seekers who landed their dream jobs with AI-powered resumes.
                    </p>
                    <Link href="/dashboard">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                        >
                            <Button size="lg" variant="secondary" className="text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
                                Get Started for Free <ArrowRight className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
