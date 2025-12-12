"use client";
import { ReactNode } from "react";

interface CardProps {
    title?: string;
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({
    title,
    children,
    className = "",
    hover = true,
}: CardProps) {
    return (
        <div
            className={`
        bg-card rounded-xl border border-border p-6 shadow-sm
        ${hover ? "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300" : ""}
        ${className}
      `}
        >
            {title && (
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}
