"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center space-x-2 opacity-50">
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                <div className="h-6 w-11 rounded-full bg-muted animate-pulse" />
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            </div>
        );
    }

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const isDark = theme === "dark";

    return (
        <div
            className={cn(
                "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 relative",
                isDark
                    ? "bg-zinc-950 border border-zinc-800"
                    : "bg-white border border-zinc-200"
            )}
            onClick={toggleTheme}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTheme();
                }
            }}
            aria-label="Toggle theme"
        >
            <div className="flex justify-between items-center w-full">
                {/* Sliding indicator with icon */}
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300",
                        isDark
                            ? "transform translate-x-0 bg-zinc-800"
                            : "transform translate-x-8 bg-gray-200"
                    )}
                >
                    {isDark ? (
                        <Moon
                            className="w-4 h-4 text-white"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <Sun
                            className="w-4 h-4 text-gray-700"
                            strokeWidth={1.5}
                        />
                    )}
                </div>

                {/* Static icon on the other side */}
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 absolute",
                        isDark
                            ? "right-1"
                            : "left-1"
                    )}
                >
                    {isDark ? (
                        <Sun
                            className="w-4 h-4 text-gray-500"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <Moon
                            className="w-4 h-4 text-gray-400"
                            strokeWidth={1.5}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
