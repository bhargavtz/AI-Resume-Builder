/**
 * Rate Limiting Utility
 * Uses Upstash Redis in production when configured, falls back to in-memory for local dev.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

export interface RateLimitInfo {
    remaining: number;
    resetIn: number;
}

class InMemoryRateLimiter {
    private limits = new Map<string, RateLimitEntry>();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }

    check(userId: string, limit: number, windowMs: number): RateLimitInfo & { success: boolean } {
        const now = Date.now();
        const userLimit = this.limits.get(userId);

        if (!userLimit || now > userLimit.resetTime) {
            this.limits.set(userId, { count: 1, resetTime: now + windowMs });
            return {
                success: true,
                remaining: limit - 1,
                resetIn: Math.ceil(windowMs / 1000),
            };
        }

        if (userLimit.count >= limit) {
            return {
                success: false,
                remaining: 0,
                resetIn: Math.max(0, Math.ceil((userLimit.resetTime - now) / 1000)),
            };
        }

        userLimit.count++;
        return {
            success: true,
            remaining: Math.max(0, limit - userLimit.count),
            resetIn: Math.max(0, Math.ceil((userLimit.resetTime - now) / 1000)),
        };
    }

    private cleanup() {
        const now = Date.now();
        for (const [userId, entry] of this.limits.entries()) {
            if (now > entry.resetTime) {
                this.limits.delete(userId);
            }
        }
    }

    clear() {
        this.limits.clear();
    }

    destroy() {
        clearInterval(this.cleanupInterval);
        this.limits.clear();
    }
}

class UpstashRateLimiter {
    private limiters = new Map<string, Ratelimit>();

    private getLimiter(limit: number, windowMs: number): Ratelimit {
        const key = `${limit}:${windowMs}`;
        const existing = this.limiters.get(key);
        if (existing) return existing;

        const redis = Redis.fromEnv();
        const limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
            prefix: 'ai-resume-builder',
        });
        this.limiters.set(key, limiter);
        return limiter;
    }

    async check(userId: string, limit: number, windowMs: number): Promise<RateLimitInfo & { success: boolean }> {
        const limiter = this.getLimiter(limit, windowMs);
        const result = await limiter.limit(userId);
        return {
            success: result.success,
            remaining: result.remaining,
            resetIn: Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
        };
    }
}

const inMemoryLimiter = new InMemoryRateLimiter();
const upstashLimiter =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? new UpstashRateLimiter()
        : null;

export async function applyRateLimit(
    userId: string,
    limit: number = 10,
    windowMs: number = 60000
): Promise<RateLimitInfo & { success: boolean }> {
    if (upstashLimiter) {
        return upstashLimiter.check(userId, limit, windowMs);
    }
    return inMemoryLimiter.check(userId, limit, windowMs);
}

// Legacy sync helpers for tests
export function checkRateLimit(userId: string, limit: number = 10, windowMs: number = 60000): boolean {
    return inMemoryLimiter.check(userId, limit, windowMs).success;
}

export function getRateLimitInfo(userId: string, limit: number = 10, windowMs: number = 60000): RateLimitInfo {
    const result = inMemoryLimiter.check(userId, limit, windowMs);
    return { remaining: result.remaining, resetIn: result.resetIn };
}

export default inMemoryLimiter;
