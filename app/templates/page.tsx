import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Sparkles, Download, Eye } from "lucide-react";
import Link from "next/link";

const templates = [
    {
        id: 1,
        name: "Modern Professional",
        description: "Clean and contemporary design perfect for tech and creative roles",
        category: "Professional",
        color: "from-blue-500 to-cyan-500",
        popular: true,
    },
    {
        id: 2,
        name: "Executive Classic",
        description: "Timeless elegance for senior positions and leadership roles",
        category: "Executive",
        color: "from-gray-700 to-gray-900",
        popular: false,
    },
    {
        id: 3,
        name: "Creative Portfolio",
        description: "Bold and artistic layout for designers and creatives",
        category: "Creative",
        color: "from-purple-500 to-pink-500",
        popular: true,
    },
    {
        id: 4,
        name: "Minimalist",
        description: "Simple and focused design that lets your content shine",
        category: "Minimal",
        color: "from-green-500 to-emerald-500",
        popular: false,
    },
    {
        id: 5,
        name: "Tech Innovator",
        description: "Modern tech-inspired design for developers and engineers",
        category: "Tech",
        color: "from-violet-500 to-purple-600",
        popular: true,
    },
    {
        id: 6,
        name: "Academic Scholar",
        description: "Structured format ideal for academic and research positions",
        category: "Academic",
        color: "from-amber-500 to-orange-500",
        popular: false,
    },
];

const categories = ["All", "Professional", "Executive", "Creative", "Minimal", "Tech", "Academic"];

export default function TemplatesPage() {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

                <div className="max-w-4xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
                        <FileText className="h-4 w-4" />
                        Resume Templates
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Beautiful <span className="text-gradient">ATS-Friendly</span> Templates
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose from our collection of professionally designed templates. All templates are optimized for Applicant Tracking Systems.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 border-b border-border">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === "All"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="py-16 max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                        >
                            {template.popular && (
                                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                    Popular
                                </div>
                            )}

                            {/* Template Preview */}
                            <div className={`h-48 bg-gradient-to-br ${template.color} relative`}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-32 bg-white/90 rounded-lg shadow-lg p-2">
                                        <div className="h-4 w-12 bg-gray-300 rounded mb-2" />
                                        <div className="h-2 w-full bg-gray-200 rounded mb-1" />
                                        <div className="h-2 w-3/4 bg-gray-200 rounded mb-2" />
                                        <div className="h-2 w-full bg-gray-100 rounded mb-1" />
                                        <div className="h-2 w-5/6 bg-gray-100 rounded mb-1" />
                                        <div className="h-2 w-4/5 bg-gray-100 rounded" />
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                        <Eye className="h-5 w-5 text-white" />
                                    </button>
                                    <Link
                                        href="/dashboard"
                                        className="p-3 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                                    >
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </Link>
                                </div>
                            </div>

                            {/* Template Info */}
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg">{template.name}</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                        {template.category}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                                <Link
                                    href="/dashboard"
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium"
                                >
                                    <Download className="h-4 w-4" />
                                    Use Template
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-primary text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Can't Find What You're Looking For?
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                        Our AI can help you create a custom resume tailored to your specific needs.
                    </p>
                    <Link
                        href="/dashboard"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                            Create Custom Resume
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
