/**
 * Retry Utility with Exponential Backoff
 * Handles transient failures in API calls
 */

interface RetryOptions {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    retryableErrors: ['429', '503', 'timeout', 'ECONNRESET', 'ETIMEDOUT', 'RESOURCE_EXHAUSTED'],
};

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: any, retryableErrors: string[]): boolean {
    const errorMessage = error?.message || String(error);

    return retryableErrors.some(retryable =>
        errorMessage.toLowerCase().includes(retryable.toLowerCase())
    );
}

/**
 * Calculates delay with exponential backoff
 */
function calculateDelay(attempt: number, initialDelay: number, maxDelay: number): number {
    const delay = initialDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, maxDelay);
}

/**
 * Retries an async function with exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError: any;

    for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            // Don't retry if error is not retryable
            if (!isRetryableError(error, opts.retryableErrors)) {
                throw error;
            }

            // Don't retry if this was the last attempt
            if (attempt === opts.maxRetries) {
                break;
            }

            // Wait before retrying
            const delay = calculateDelay(attempt, opts.initialDelayMs, opts.maxDelayMs);

            if (process.env.NODE_ENV === 'development') {
                console.log(`[Retry] Attempt ${attempt} failed, retrying in ${delay}ms...`);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Circuit breaker state
 */
class CircuitBreaker {
    private failures = 0;
    private lastFailureTime = 0;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    constructor(
        private threshold: number = 5,
        private resetTimeoutMs: number = 60000
    ) { }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            const timeSinceLastFailure = Date.now() - this.lastFailureTime;

            if (timeSinceLastFailure < this.resetTimeoutMs) {
                throw new Error('Circuit breaker is OPEN. Service temporarily unavailable.');
            }

            this.state = 'HALF_OPEN';
        }

        try {
            const result = await fn();

            if (this.state === 'HALF_OPEN') {
                this.state = 'CLOSED';
                this.failures = 0;
            }

            return result;
        } catch (error) {
            this.failures++;
            this.lastFailureTime = Date.now();

            if (this.failures >= this.threshold) {
                this.state = 'OPEN';
            }

            throw error;
        }
    }

    getState() {
        return this.state;
    }

    reset() {
        this.state = 'CLOSED';
        this.failures = 0;
        this.lastFailureTime = 0;
    }
}

// Singleton circuit breaker for AI service
export const aiCircuitBreaker = new CircuitBreaker(5, 60000);
