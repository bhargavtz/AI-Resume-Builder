import {
    Facebook,
    Github,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
    Linkedin,
    Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const data = {
    facebookLink: 'https://facebook.com',
    instaLink: 'https://instagram.com',
    twitterLink: 'https://x.com/bhargavtz',
    githubLink: 'https://github.com/bhargavtz',
    linkedinLink: 'https://linkedin.com/in/bhargavtz',
    services: {
        templates: '/templates',
        aitools: '/ai-tools',
        pricing: '/pricing',
        dashboard: '/dashboard',
    },
    about: {
        about: '/about',
        features: '/#features',
        testimonials: '/#testimonials',
        faq: '/faq',
    },
    help: {
        support: '/contact',
        docs: '/faq',
        contact: '/contact',
    },
    contact: {
        email: 'bhargav05@yandex.com',
        phone: '+91 1234567890',
        address: 'India',
    },
    company: {
        name: 'AI Resume Builder',
        description:
            'Create stunning, ATS-friendly resumes in minutes with the power of AI. Stand out from the crowd and land your dream job.',
        logo: '/logo.png',
    },
};

const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: data.twitterLink },
    { icon: Linkedin, label: 'LinkedIn', href: data.linkedinLink },
    { icon: Github, label: 'GitHub', href: data.githubLink },
];

const aboutLinks = [
    { text: 'About Us', href: data.about.about },
    { text: 'Features', href: data.about.features },
    { text: 'Testimonials', href: data.about.testimonials },
    { text: 'FAQ', href: data.about.faq },
];

const serviceLinks = [
    { text: 'Templates', href: data.services.templates },
    { text: 'AI Tools', href: data.services.aitools },
    { text: 'Pricing', href: data.services.pricing },
    { text: 'Dashboard', href: data.services.dashboard },
];

const helpfulLinks = [
    { text: 'Support', href: data.help.support },
    { text: 'Documentation', href: data.help.docs },
    { text: 'Contact Us', href: data.help.contact },
];

const contactInfo = [
    { icon: Mail, text: data.contact.email, href: `mailto:${data.contact.email}` },
    { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
    return (
        <footer className="bg-secondary dark:bg-secondary/20 w-full place-self-end rounded-t-xl">
            <div className="mx-auto max-w-screen-xl px-4 p-8 pt-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <div className="text-primary flex justify-center gap-2 sm:justify-start items-center">
                            <div className="p-2 rounded-lg bg-primary/20">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-2xl font-semibold">
                                {data.company.name}
                            </span>
                        </div>

                        <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
                            {data.company.description}
                        </p>

                        <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
                            {socialLinks.map(({ icon: Icon, label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 transition"
                                    >
                                        <span className="sr-only">{label}</span>
                                        <Icon className="size-6" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">About</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {aboutLinks.map(({ text, href }) => (
                                    <li key={text}>
                                        <Link
                                            className="text-secondary-foreground/70 hover:text-foreground transition"
                                            href={href}
                                        >
                                            {text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Product</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {serviceLinks.map(({ text, href }) => (
                                    <li key={text}>
                                        <Link
                                            className="text-secondary-foreground/70 hover:text-foreground transition"
                                            href={href}
                                        >
                                            {text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Support</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {helpfulLinks.map(({ text, href }) => (
                                    <li key={text}>
                                        <Link
                                            href={href}
                                            className="text-secondary-foreground/70 hover:text-foreground transition"
                                        >
                                            {text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Contact</p>
                            <ul className="mt-8 space-y-4 text-sm">
                                {contactInfo.map(({ icon: Icon, text, isAddress, href }) => (
                                    <li key={text}>
                                        {href ? (
                                            <Link
                                                className="flex items-center justify-center gap-1.5 sm:justify-start group"
                                                href={href}
                                            >
                                                <Icon className="text-primary size-5 shrink-0 shadow-sm" />
                                                <span className="text-secondary-foreground/70 group-hover:text-foreground flex-1 transition">
                                                    {text}
                                                </span>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                                                <Icon className="text-primary size-5 shrink-0 shadow-sm" />
                                                {isAddress ? (
                                                    <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
                                                        {text}
                                                    </address>
                                                ) : (
                                                    <span className="text-secondary-foreground/70 flex-1 transition">
                                                        {text}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t pt-6">
                    <div className="text-center sm:flex sm:justify-between sm:text-left">
                        <p className="text-sm">
                            <span className="block sm:inline">All rights reserved.</span>
                        </p>

                        <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
                            &copy; {new Date().getFullYear()} {data.company.name}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
