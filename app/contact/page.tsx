"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const contactMethods = [
    {
        icon: Mail,
        title: "Email Us",
        description: "We'll respond within 24 hours",
        value: "bhargav05@yandex.com",
    },
    {
        icon: MessageSquare,
        title: "Live Chat",
        description: "Available Mon-Fri, 9am-5pm EST",
        value: "Start a conversation",
    },
    // {
    //     icon: MapPin,
    //     title: "Office",
    //     description: "Visit our headqua",
    //     value: "San Francisco, CA",
    // },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitted(true);
        setIsSubmitting(false);
    };

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

                <div className="max-w-4xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
                        <Mail className="h-4 w-4" />
                        Contact Us
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Get in <span className="text-gradient">Touch</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a question or feedback? We'd love to hear from you. Our team is here to help.
                    </p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-12 border-b border-border">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        {contactMethods.map((method, idx) => (
                            <div key={idx} className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow text-center">
                                <div className="p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                                    <method.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                                <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                                <p className="text-primary font-medium">{method.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Send Us a Message</h2>

                    {submitted ? (
                        <div className="p-8 rounded-2xl border border-green-500/20 bg-green-500/5 text-center">
                            <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto mb-4">
                                <Send className="h-8 w-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                            <p className="text-muted-foreground">
                                Thank you for reaching out. We'll get back to you within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="raj kumar"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="raj@gmail.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
