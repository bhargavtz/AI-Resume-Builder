/**
 * Simple in-memory cache utility
 * For production, use Redis or similar
 */

interface CacheEntry<T> {
    data: T;
    expiry: number;
}

class Cache {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Cleanup expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    /**
     * Set a cache entry
     * @param key - Cache key
     * @param data - Data to cache
     * @param ttlSeconds - Time to live in seconds (default: 5 minutes)
     */
    set<T>(key: string, data: T, ttlSeconds: number = 300): void {
        const expiry = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { data, expiry });
    }

    /**
     * Get a cache entry
     * @param key - Cache key
     * @returns Cached data or null if not found/expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Delete a cache entry
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Cleanup expired entries
     */
    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiry) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get cache statistics
     */
    stats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    /**
     * Cleanup on shutdown
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.cache.clear();
    }
}

// Singleton instance
const cache = new Cache();

export default cache;

// Helper function for caching API responses
export async function withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 300
): Promise<T> {
    // Try to get from cache
    const cached = cache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    // Fetch and cache
    const data = await fetcher();
    cache.set(key, data, ttlSeconds);
    return data;
}
