/**
 * Loading Spinner Component
 * Reusable loading indicator for async operations
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    label?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
};

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div
                className={cn(
                    'animate-spin rounded-full border-primary border-t-transparent',
                    sizeClasses[size],
                    className
                )}
                role="status"
                aria-label={label || 'Loading'}
            />
            {label && (
                <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
            )}
        </div>
    );
}

interface LoadingOverlayProps {
    isLoading: boolean;
    label?: string;
    children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, label, children }: LoadingOverlayProps) {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                    <LoadingSpinner size="lg" label={label} />
                </div>
            )}
        </div>
    );
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export function LoadingButton({
    isLoading,
    loadingText,
    children,
    disabled,
    className,
    ...props
}: LoadingButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={cn(
                'relative inline-flex items-center justify-center gap-2',
                className
            )}
        >
            {isLoading && (
                <LoadingSpinner size="sm" className="absolute left-4" />
            )}
            <span className={cn(isLoading && 'opacity-0')}>
                {children}
            </span>
            {isLoading && loadingText && (
                <span className="absolute">{loadingText}</span>
            )}
        </button>
    );
}

/**
 * Skeleton Loader for Dashboard Cards
 */
export function SkeletonCard() {
    return (
        <div className="p-6 rounded-xl border border-border bg-card animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
    );
}

export function SkeletonResumeCard() {
    return (
        <div className="p-6 rounded-xl border border-border bg-card animate-pulse">
            <div className="h-32 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
    );
}
