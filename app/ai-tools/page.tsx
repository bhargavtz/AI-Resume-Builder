"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, Variants } from "framer-motion";
import {
    Sparkles, FileText, Target, PenTool, Lightbulb, TrendingUp,
    Loader2, Copy, Check, ArrowRight
} from "lucide-react";
import AIService from "@/service/AIService";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const tools = [
    {
        id: "summary",
        name: "AI Summary Generator",
        description: "Generate a professional resume summary",
        icon: FileText,
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: "bullets",
        name: "Bullet Points Generator",
        description: "Create impactful experience bullets",
        icon: PenTool,
        color: "from-purple-500 to-pink-500",
    },
    {
        id: "ats",
        name: "ATS Score Checker",
        description: "Check ATS compatibility",
        icon: Target,
        color: "from-green-500 to-emerald-500",
    },
    {
        id: "cover",
        name: "Cover Letter Generator",
        description: "Generate personalized cover letters",
        icon: Sparkles,
        color: "from-orange-500 to-red-500",
    },
    {
        id: "skills",
        name: "Skills Suggester",
        description: "Get relevant skill suggestions",
        icon: Lightbulb,
        color: "from-yellow-500 to-amber-500",
    },
    {
        id: "improve",
        name: "Resume Improver",
        description: "Get improvement suggestions",
        icon: TrendingUp,
        color: "from-indigo-500 to-violet-500",
    },
];

export default function AIToolsPage() {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Form states
    const [jobTitle, setJobTitle] = useState("");
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [context, setContext] = useState<"experience" | "project">("experience");

    const handleGenerate = async () => {
        if (!jobTitle.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            let response;

            switch (activeTool) {
                case "summary":
                    response = await AIService.generateSummary({ jobTitle, experience, skills });
                    setResult({ type: "text", content: response.summary });
                    break;

                case "bullets":
                    response = await AIService.generateBullets({ jobTitle, context, experience, skills });
                    setResult({ type: "bullets", content: response.bullets });
                    break;

                case "cover":
                    response = await AIService.generateCoverLetter({
                        resumeContent: { personalDetails: { jobTitle } },
                        jobTitle,
                        companyName,
                        jobDescription
                    });
                    setResult({ type: "text", content: response.coverLetter });
                    break;

                case "skills":
                    response = await AIService.suggestSkills({
                        jobTitle,
                        currentSkills: skills.split(",").map(s => s.trim())
                    });
                    setResult({ type: "skills", content: response.skills });
                    break;

                case "ats":
                    response = await AIService.checkATSScore({
                        resumeContent: {
                            personalDetails: { jobTitle },
                            skills: skills.split(",").map((s, i) => ({ id: `skill-${i}`, name: s.trim(), rating: 0 }))
                        },
                        jobDescription
                    });
                    setResult({ type: "ats", content: response });
                    break;

                case "improve":
                    response = await AIService.improveResume({
                        resumeContent: {
                            personalDetails: { jobTitle },
                            experience: [{ id: "exp-1", title: jobTitle, workSummary: experience }],
                            skills: skills.split(",").map((s, i) => ({ id: `skill-${i}`, name: s.trim(), rating: 0 }))
                        },
                        targetJobTitle: jobTitle
                    });
                    setResult({ type: "improve", content: response });
                    break;
            }
        } catch (error: any) {
            setResult({ type: "error", content: error.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderResult = () => {
        if (!result) return null;

        switch (result.type) {
            case "text":
                return (
                    <div className="relative">
                        <button
                            onClick={() => copyToClipboard(result.content)}
                            className="absolute top-2 right-2 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <p className="whitespace-pre-wrap pr-12">{result.content}</p>
                    </div>
                );

            case "bullets":
                return (
                    <ul className="space-y-2">
                        {result.content?.map((bullet: string, i: number) => (
                            <li key={i} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <span>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                );

            case "skills":
                return (
                    <div className="flex flex-wrap gap-2">
                        {result.content?.map((skill: any, i: number) => (
                            <span
                                key={i}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${skill.importance === "High"
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                );

            case "ats":
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`text-4xl font-bold ${result.content.score >= 80 ? "text-green-500" :
                                result.content.score >= 60 ? "text-yellow-500" : "text-red-500"
                                }`}>
                                {result.content.score}%
                            </div>
                            <p className="text-muted-foreground">{result.content.summary}</p>
                        </div>
                        {result.content.improvements?.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Improvements:</h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    {result.content.improvements.map((item: string, i: number) => (
                                        <li key={i}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );

            case "improve":
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold text-primary">
                                {result.content.overallScore}/100
                            </div>
                            <p className="text-muted-foreground">{result.content.summary}</p>
                        </div>
                        {result.content.topPriorities?.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Top Priorities:</h4>
                                <ul className="space-y-1 text-sm">
                                    {result.content.topPriorities.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-primary">→</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );

            case "error":
                return <p className="text-red-500">{result.content}</p>;

            default:
                return <pre className="text-sm overflow-auto">{JSON.stringify(result.content, null, 2)}</pre>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-4">
                        <Sparkles className="h-4 w-4" />
                        AI-Powered Tools
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Resume <span className="text-gradient">AI Tools</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Use our AI-powered tools to enhance your resume and land your dream job.
                    </p>
                </motion.div>

                {/* Tools Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    {tools.map((tool) => (
                        <motion.button
                            key={tool.id}
                            onClick={() => {
                                setActiveTool(tool.id);
                                setResult(null);
                            }}
                            className={`p-4 rounded-xl border text-center transition-all ${activeTool === tool.id
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border bg-card hover:border-primary/50"
                                }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3`}>
                                <tool.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-medium text-sm">{tool.name}</h3>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Active Tool Panel */}
                {activeTool && (
                    <motion.div
                        className="grid lg:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Input Panel */}
                        <div className="p-6 rounded-2xl border border-border bg-card">
                            <h2 className="text-xl font-semibold mb-4">
                                {tools.find(t => t.id === activeTool)?.name}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Job Title *</label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder="e.g., Software Engineer"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                {(activeTool === "cover") && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Company Name *</label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="e.g., Google"
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {(activeTool === "bullets") && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Context</label>
                                        <select
                                            value={context}
                                            onChange={(e) => setContext(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none transition-all"
                                        >
                                            <option value="experience">Work Experience</option>
                                            <option value="project">Project</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2">Experience/Description</label>
                                    <textarea
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="Brief description of your experience..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        placeholder="e.g., React, Node.js, Python"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none transition-all"
                                    />
                                </div>

                                {(activeTool === "cover" || activeTool === "ats") && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Job Description (optional)</label>
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder="Paste job description for better results..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !jobTitle.trim()}
                                    className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5" />
                                            Generate with AI
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Result Panel */}
                        <div className="p-6 rounded-2xl border border-border bg-card">
                            <h2 className="text-xl font-semibold mb-4">Result</h2>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                                    <p className="text-muted-foreground">AI is thinking...</p>
                                </div>
                            ) : result ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {renderResult()}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="p-4 rounded-2xl bg-muted mb-4">
                                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">
                                        Fill in the form and click "Generate" to see results
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
