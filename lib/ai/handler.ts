import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { applyRateLimit } from '@/lib/rate-limit';
import { LIMITS } from '@/lib/constants';
import logger from '@/lib/logger';

export interface AIRouteConfig {
    path: string;
    rateLimit?: number;
    windowMs?: number;
}

export interface AIContext {
    userId: string;
    requestId: string;
    body: unknown;
}

function isCircuitBreakerError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('Circuit breaker is OPEN');
}

function isRateLimitError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    const msg = error.message;
    return msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
}

export async function executeAIRoute<T>(
    req: NextRequest,
    config: AIRouteConfig,
    handler: (ctx: AIContext) => Promise<T>
): Promise<NextResponse> {
    const requestId = nanoid(16);
    const rateLimit = config.rateLimit ?? LIMITS.RATE_LIMIT_AI;
    const windowMs = config.windowMs ?? LIMITS.RATE_LIMIT_WINDOW_MS;

    try {
        const { userId } = await auth();
        if (!userId) {
            logger.warn(`Unauthorized AI request: ${config.path}`, {}, undefined, requestId);
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        logger.apiRequest('POST', config.path, userId, requestId);

        const rateLimitResult = await applyRateLimit(userId, rateLimit, windowMs);
        if (!rateLimitResult.success) {
            logger.warn('Rate limit exceeded', { userId }, userId, requestId);
            return NextResponse.json(
                { message: 'Rate limit exceeded. Please try again later.', retryAfter: rateLimitResult.resetIn },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.resetIn.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-Request-ID': requestId,
                    },
                }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            logger.error('Gemini API key not configured', {}, userId, requestId);
            return NextResponse.json(
                { message: 'AI service temporarily unavailable' },
                { status: 503 }
            );
        }

        const body = await req.json();
        const result = await handler({ userId, requestId, body });

        return NextResponse.json(result, {
            headers: {
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
                'X-Request-ID': requestId,
            },
        });
    } catch (error: unknown) {
        if (error instanceof AIValidationError) {
            return validationError(error.message);
        }

        logger.apiError('POST', config.path, error instanceof Error ? error : new Error(String(error)), undefined, requestId);

        if (isCircuitBreakerError(error)) {
            return NextResponse.json(
                { message: 'AI service is temporarily unavailable. Please try again in a minute.' },
                { status: 503 }
            );
        }

        if (isRateLimitError(error)) {
            return NextResponse.json(
                { message: 'AI service is temporarily busy. Please try again in a minute.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { message: 'AI request failed. Please try again.' },
            { status: 500 }
        );
    }
}

export class AIValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AIValidationError';
    }
}

export function validationError(message: string): NextResponse {
    return NextResponse.json({ message }, { status: 400 });
}
