import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Heart, Sparkles, Award, Globe } from "lucide-react";
import Link from "next/link";

const teamMembers = [
    {
        name: "Bhargav",
        role: "Founder & CEO",
        bio: "Former Google engineer passionate about helping people land their dream jobs.",
        avatar: "B",
    }
    // },
    // {
    //     name: "Bhargav",
    //     role: "Head of AI",
    //     bio: "PhD in NLP from Stanford, building the future of AI-powered career tools.",
    //     avatar: "B",
    // },
    // {
    //     name: "Bhargav",
    //     role: "Lead Designer",
    //     bio: "15+ years crafting beautiful user experiences at top tech companies.",
    //     avatar: "B",
    // },
];

const values = [
    {
        icon: Target,
        title: "Mission-Driven",
        description: "We're on a mission to democratize access to professional resume building tools.",
    },
    {
        icon: Heart,
        title: "User First",
        description: "Every feature we build starts with understanding our users' needs.",
    },
    {
        icon: Sparkles,
        title: "Innovation",
        description: "We leverage cutting-edge AI to deliver the best possible experience.",
    },
    {
        icon: Globe,
        title: "Accessibility",
        description: "We believe everyone deserves access to tools that help them succeed.",
    },
];

const stats = [
    { value: "200+", label: "Resumes Created" },
    { value: "85%", label: "Success Rate" },
    { value: "15+", label: "Countries" },
    { value: "4.0★", label: "User Rating" },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

                <div className="max-w-4xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
                        <Users className="h-4 w-4" />
                        About Us
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Building the Future of <span className="text-gradient">Career Success</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We're a team of passionate engineers, designers, and career experts on a mission to help everyone create professional resumes that get noticed.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-border bg-muted/30">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
                <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
                    <p className="mb-4">
                        AI Resume Builder was born from a simple observation: creating a professional resume shouldn't be hard. Too many talented people miss out on opportunities because they struggle to present their skills effectively.
                    </p>
                    <p className="mb-4">
                        In 2024, we set out to change that. By combining cutting-edge AI technology with expert career knowledge, we've built a platform that helps anyone create stunning, ATS-optimized resumes in minutes.
                    </p>
                    <p>
                        Today, we're proud to have helped over 50,000 job seekers land their dream jobs. But we're just getting started.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                                    <value.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                                <p className="text-muted-foreground text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Meet the Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, idx) => (
                            <div key={idx} className="text-center p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    {member.avatar}
                                </div>
                                <h3 className="font-semibold text-lg">{member.name}</h3>
                                <p className="text-primary text-sm mb-2">{member.role}</p>
                                <p className="text-muted-foreground text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 gradient-primary text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Award className="h-12 w-12 mx-auto mb-6 opacity-80" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Build Your Future?
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                        Join thousands of successful job seekers who've landed their dream jobs.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all shadow-lg"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
