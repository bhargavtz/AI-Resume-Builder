import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
    {
        name: "Free Forever",
        price: "₹0",
        period: "forever",
        description: "Everything you need to create professional resumes",
        icon: Sparkles,
        features: [
            { name: "Unlimited Resumes", included: true },
            { name: "Professional Templates", included: true },
            { name: "AI Writing Assistant", included: true },
            { name: "PDF Export", included: true },
            { name: "ATS Optimization", included: true },
            { name: "Real-time Preview", included: true },
            { name: "Auto-Save", included: true },
        ],
        cta: "Get Started Free",
        href: "/dashboard",
        popular: true,
    },
];

export default function PricingPage() {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
                <div className="absolute top-10 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

                <div className="max-w-4xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
                        <Sparkles className="h-4 w-4" />
                        Simple, Transparent Pricing
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Choose Your <span className="text-gradient">Perfect Plan</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Start for free, upgrade when you need more power. No hidden fees, cancel anytime.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 max-w-2xl mx-auto px-4">
                <div className="grid gap-8">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-2 ${plan.popular
                                ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                                : "border-border bg-card hover:shadow-lg"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-xl ${plan.popular ? "bg-primary/20" : "bg-muted"}`}>
                                    <plan.icon className={`h-6 w-6 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">/{plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <Check className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <X className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`block w-full text-center py-3 px-6 rounded-full font-medium transition-all ${plan.popular
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                                    : "bg-muted hover:bg-muted/80 text-foreground"
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mb-8">
                        Have questions? We have answers. Check out our FAQ or contact support.
                    </p>
                    <Link
                        href="/faq"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-muted transition-colors font-medium"
                    >
                        View All FAQ
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
