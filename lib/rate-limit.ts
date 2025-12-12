/**
 * Rate Limiting Utility
 * Prevents API abuse by limiting requests per user
 * In-memory implementation (can be upgraded to Redis for production)
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private limits: Map<string, RateLimitEntry> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Cleanup expired entries every minute
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }

    /**
     * Check if a user has exceeded their rate limit
     * @param userId - User identifier
     * @param limit - Maximum requests allowed
     * @param windowMs - Time window in milliseconds
     * @returns true if request is allowed, false if rate limited
     */
    check(userId: string, limit: number = 10, windowMs: number = 60000): boolean {
        const now = Date.now();
        const userLimit = this.limits.get(userId);

        // No previous requests or window expired
        if (!userLimit || now > userLimit.resetTime) {
            this.limits.set(userId, {
                count: 1,
                resetTime: now + windowMs
            });
            return true;
        }

        // Rate limit exceeded
        if (userLimit.count >= limit) {
            return false;
        }

        // Increment count
        userLimit.count++;
        return true;
    }

    /**
     * Get remaining requests for a user
     */
    getRemaining(userId: string, limit: number = 10): number {
        const userLimit = this.limits.get(userId);
        if (!userLimit || Date.now() > userLimit.resetTime) {
            return limit;
        }
        return Math.max(0, limit - userLimit.count);
    }

    /**
     * Get time until reset (in seconds)
     */
    getResetTime(userId: string): number {
        const userLimit = this.limits.get(userId);
        if (!userLimit) return 0;

        const remaining = userLimit.resetTime - Date.now();
        return Math.max(0, Math.ceil(remaining / 1000));
    }

    /**
     * Cleanup expired entries
     */
    private cleanup() {
        const now = Date.now();
        for (const [userId, entry] of this.limits.entries()) {
            if (now > entry.resetTime) {
                this.limits.delete(userId);
            }
        }
    }

    /**
     * Clear all rate limits (for testing)
     */
    clear() {
        this.limits.clear();
    }

    /**
     * Cleanup on shutdown
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.limits.clear();
    }
}

// Singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;

// Helper function for API routes
export function checkRateLimit(userId: string, limit?: number, windowMs?: number) {
    return rateLimiter.check(userId, limit, windowMs);
}

export function getRateLimitInfo(userId: string, limit: number = 10) {
    return {
        remaining: rateLimiter.getRemaining(userId, limit),
        resetIn: rateLimiter.getResetTime(userId)
    };
}
