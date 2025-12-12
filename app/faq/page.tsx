"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const faqCategories = [
    {
        name: "Getting Started",
        faqs: [
            {
                question: "How do I create my first resume?",
                answer: "Simply sign up for a free account, click 'New Resume' on your dashboard, and our AI will guide you through the process step by step. You can have a professional resume ready in minutes.",
            },
            {
                question: "Is AI Resume Builder really free?",
                answer: "Yes! AI Resume Builder is completely free to use. Create unlimited resumes with professional templates and AI writing assistance.",
            },
            {
                question: "Do I need any design skills?",
                answer: "Not at all! Our templates are professionally designed, and our AI handles all the formatting. You just need to provide your information.",
            },
        ],
    },
    {
        name: "AI Features",
        faqs: [
            {
                question: "How does the AI writing assistant work?",
                answer: "Our AI analyzes your job title, experience, and industry to generate tailored content. It creates professional summaries, bullet points, and skill suggestions optimized for your target role.",
            },
            {
                question: "Is the AI content plagiarism-free?",
                answer: "Yes, all AI-generated content is unique and created specifically for your resume. It's not copied from any source.",
            },
            {
                question: "Can I edit the AI suggestions?",
                answer: "Absolutely! AI suggestions are just a starting point. You can edit, customize, or completely rewrite any content we generate.",
            },
        ],
    },
    {
        name: "ATS & Compatibility",
        faqs: [
            {
                question: "What is ATS and why does it matter?",
                answer: "ATS (Applicant Tracking System) is software used by employers to scan and filter resumes. Our templates are optimized to pass ATS scans while still looking great to human recruiters.",
            },
            {
                question: "Are your templates ATS-friendly?",
                answer: "Yes, all our templates are designed with ATS compatibility in mind. We use proper formatting, readable fonts, and structured layouts that ATS systems can parse correctly.",
            },
            {
                question: "How can I check my resume's ATS score?",
                answer: "You can use our built-in ATS optimization features to ensure your resume is formatted correctly for applicant tracking systems.",
            },
        ],
    },
    {
        name: "Export & Sharing",
        faqs: [
            {
                question: "What formats can I export my resume in?",
                answer: "You can export your resume to PDF format with perfect formatting maintained.",
            },
            {
                question: "Can I share my resume via link?",
                answer: "You can download your resume and share it via email or upload it to job application portals.",
            },
            {
                question: "Will my resume look the same when printed?",
                answer: "Yes, our export system ensures your resume maintains perfect formatting across all devices and when printed.",
            },
        ],
    },
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleItem = (id: string) => {
        setOpenItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredCategories = faqCategories
        .map((category) => ({
            ...category,
            faqs: category.faqs.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((category) => category.faqs.length > 0);

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

                <div className="max-w-4xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
                        <HelpCircle className="h-4 w-4" />
                        Help Center
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Find answers to common questions about AI Resume Builder.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-16 max-w-4xl mx-auto px-4">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredCategories.map((category, catIdx) => (
                            <div key={catIdx}>
                                <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                                <div className="space-y-4">
                                    {category.faqs.map((faq, faqIdx) => {
                                        const itemId = `${catIdx}-${faqIdx}`;
                                        const isOpen = openItems.includes(itemId);

                                        return (
                                            <div
                                                key={faqIdx}
                                                className="border border-border rounded-xl overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleItem(itemId)}
                                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                                                >
                                                    <span className="font-medium pr-4">{faq.question}</span>
                                                    <ChevronDown
                                                        className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-5 text-muted-foreground">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Still Need Help CTA */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="text-muted-foreground mb-8">
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                    >
                        Contact Support
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
