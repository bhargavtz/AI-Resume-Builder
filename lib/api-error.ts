/**
 * Standardized API Error Handling
 * Provides consistent error responses and logging
 */

import { NextResponse } from 'next/server';
import logger from './logger';
import { nanoid } from 'nanoid';

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code: string,
        public meta?: object
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Standard error codes used across the application
 */
export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
} as const;

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    message?: string;
    details?: any;
}

/**
 * Creates a standardized success response
 */
export function successResponse<T>(
    data: T,
    message?: string,
    headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
    const response: ApiResponse<T> = {
        success: true,
        data,
        ...(message && { message }),
    };

    return NextResponse.json(response, {
        status: 200,
        headers: headers || {},
    });
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
    message: string,
    code: string,
    statusCode: number = 400,
    details?: any
): NextResponse<ApiResponse> {
    const response: ApiResponse = {
        success: false,
        error: message,
        code,
        ...(details && { details }),
    };

    return NextResponse.json(response, { status: statusCode });
}

/**
 * Handles API errors with consistent formatting and logging
 */
export function handleApiError(
    error: unknown,
    userId?: string,
    requestId?: string
): NextResponse {
    const reqId = requestId || nanoid(16);

    if (error instanceof ApiError) {
        logger.apiError('POST', error.message, error as Error, userId, reqId);

        return errorResponse(
            error.message,
            error.code,
            error.statusCode,
            error.meta
        );
    }

    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
        logger.error('Database validation error', { error: String(error) }, userId, reqId);
        return errorResponse(
            'Validation failed',
            ErrorCodes.VALIDATION_ERROR,
            400
        );
    }

    // Handle Mongoose cast errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
        logger.error('Database cast error', { error: String(error) }, userId, reqId);
        return errorResponse(
            'Invalid ID format',
            ErrorCodes.INVALID_INPUT,
            400
        );
    }

    // Unexpected error
    logger.error('Unexpected error', { error: String(error) }, userId, reqId);

    return errorResponse(
        'An unexpected error occurred. Please try again.',
        ErrorCodes.INTERNAL_ERROR,
        500
    );
}
