import { generateText, generateObject } from 'ai';
import type { z } from 'zod';
import { withRetry, aiCircuitBreaker } from '@/lib/retry';
import { getGoogleModel } from './client';

interface RetryOptions {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
}

const DEFAULT_RETRY: RetryOptions = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 5000,
};

export async function generateAIText(prompt: string, retry: RetryOptions = DEFAULT_RETRY): Promise<string> {
    return aiCircuitBreaker.execute(async () =>
        withRetry(async () => {
            const { text } = await generateText({
                model: getGoogleModel(),
                prompt,
            });
            return text.trim();
        }, retry)
    );
}

export async function generateAIObject<T extends z.ZodType>(
    schema: T,
    prompt: string,
    retry: RetryOptions = DEFAULT_RETRY
): Promise<z.infer<T>> {
    return aiCircuitBreaker.execute(async () =>
        withRetry(async () => {
            const { object } = await generateObject({
                model: getGoogleModel(),
                schema,
                prompt,
            });
            return object as z.infer<T>;
        }, retry)
    );
}
