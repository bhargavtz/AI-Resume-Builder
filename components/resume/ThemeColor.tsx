"use client"
import React, { useContext, useState } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Palette, Check, Sparkles } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'

// Modern, professional color palette
const colorCategories = {
    professional: [
        { name: 'Navy Blue', value: '#1e40af', gradient: 'from-blue-600 to-blue-800' },
        { name: 'Deep Purple', value: '#7c3aed', gradient: 'from-purple-600 to-purple-800' },
        { name: 'Forest Green', value: '#059669', gradient: 'from-emerald-600 to-emerald-800' },
        { name: 'Burgundy', value: '#be123c', gradient: 'from-rose-700 to-rose-900' },
        { name: 'Teal', value: '#0d9488', gradient: 'from-teal-600 to-teal-800' },
        { name: 'Slate', value: '#475569', gradient: 'from-slate-600 to-slate-800' },
    ],
    vibrant: [
        { name: 'Electric Blue', value: '#3b82f6', gradient: 'from-blue-500 to-blue-700' },
        { name: 'Vivid Purple', value: '#8b5cf6', gradient: 'from-violet-500 to-violet-700' },
        { name: 'Hot Pink', value: '#ec4899', gradient: 'from-pink-500 to-pink-700' },
        { name: 'Bright Orange', value: '#f97316', gradient: 'from-orange-500 to-orange-700' },
        { name: 'Lime Green', value: '#84cc16', gradient: 'from-lime-500 to-lime-700' },
        { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-cyan-700' },
    ],
    modern: [
        { name: 'Coral', value: '#f43f5e', gradient: 'from-rose-500 to-rose-700' },
        { name: 'Amber', value: '#f59e0b', gradient: 'from-amber-500 to-amber-700' },
        { name: 'Indigo', value: '#6366f1', gradient: 'from-indigo-500 to-indigo-700' },
        { name: 'Emerald', value: '#10b981', gradient: 'from-emerald-500 to-emerald-700' },
        { name: 'Fuchsia', value: '#d946ef', gradient: 'from-fuchsia-500 to-fuchsia-700' },
        { name: 'Sky Blue', value: '#0ea5e9', gradient: 'from-sky-500 to-sky-700' },
    ]
}

export default function ThemeColor() {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor || '#3b82f6');
    const [activeCategory, setActiveCategory] = useState<'professional' | 'vibrant' | 'modern'>('professional');

    const onColorSelect = (color: string) => {
        setSelectedColor(color);
        setResumeInfo({
            ...resumeInfo,
            themeColor: color
        });
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className='flex gap-2 hover:bg-primary/10 transition-all shadow-sm hover:shadow-md'
                >
                    <Palette className="h-4 w-4" />
                    <span className="font-medium">Theme</span>
                    <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-md ring-2 ring-border"
                        style={{ backgroundColor: selectedColor }}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start">
                <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-base">Resume Theme Color</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Choose a color that represents your professional brand
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                        {(['professional', 'vibrant', 'modern'] as const).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeCategory === category
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {colorCategories[activeCategory].map((color) => (
                            <button
                                key={color.value}
                                onClick={() => onColorSelect(color.value)}
                                className={`group relative h-16 rounded-xl transition-all hover:scale-105 ${selectedColor === color.value
                                        ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
                                        : 'hover:shadow-md'
                                    }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            >
                                {/* Color Name */}
                                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/50 backdrop-blur-sm rounded-b-xl">
                                    <p className="text-[10px] text-white font-medium text-center truncate">
                                        {color.name}
                                    </p>
                                </div>

                                {/* Check Mark */}
                                {selectedColor === color.value && (
                                    <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-md">
                                        <Check className="h-3 w-3 text-green-600" />
                                    </div>
                                )}

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all" />
                            </button>
                        ))}
                    </div>

                    {/* Custom Color Input */}
                    <div className="pt-3 border-t space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Custom Color
                        </label>
                        <div className="flex gap-2">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(e) => onColorSelect(e.target.value)}
                                    className="w-12 h-10 rounded-lg border-2 border-border cursor-pointer"
                                />
                            </div>
                            <input
                                type="text"
                                value={selectedColor}
                                onChange={(e) => onColorSelect(e.target.value)}
                                placeholder="#3b82f6"
                                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Preview</p>
                        <div className="p-3 rounded-lg border border-border bg-muted/30">
                            <h3
                                className="font-bold text-lg mb-1"
                                style={{ color: selectedColor }}
                            >
                                Your Name
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Headings and accents will use this color
                            </p>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
