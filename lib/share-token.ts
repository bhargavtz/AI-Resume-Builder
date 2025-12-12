/**
 * Enhanced Share Token Utility
 * Provides secure token generation with expiration and view limits
 */

import { nanoid } from 'nanoid';
import { LIMITS } from './constants';

export interface ShareTokenData {
    token: string;
    expiresAt: Date;
    createdAt: Date;
    maxViews?: number;
}

/**
 * Generates a secure share token with expiration
 * @param expiryDays - Number of days until token expires (default: 7)
 * @param maxViews - Optional maximum number of views allowed
 * @returns ShareTokenData object with token and metadata
 */
export function generateShareToken(
    expiryDays: number = LIMITS.SHARE_TOKEN_EXPIRY_DAYS,
    maxViews?: number
): ShareTokenData {
    // Use 32 characters for higher entropy (increased from 16)
    const token = nanoid(LIMITS.SHARE_TOKEN_LENGTH);
    const now = new Date();

    return {
        token,
        createdAt: now,
        expiresAt: new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000),
        maxViews,
    };
}

/**
 * Validates a share token's format
 * @param token - Token to validate
 * @returns true if token format is valid
 */
export function validateShareTokenFormat(token: string): boolean {
    // Check length and allowed characters (URL-safe base64)
    const tokenRegex = /^[a-zA-Z0-9_-]+$/;
    return (
        typeof token === 'string' &&
        token.length >= 16 &&
        token.length <= 64 &&
        tokenRegex.test(token)
    );
}

/**
 * Checks if a share token is expired
 * @param expiresAt - Expiration date
 * @returns true if token has expired
 */
export function isTokenExpired(expiresAt: Date | null | undefined): boolean {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
}

/**
 * Checks if view limit has been reached
 * @param viewCount - Current view count
 * @param maxViews - Maximum views allowed
 * @returns true if limit reached
 */
export function isViewLimitReached(
    viewCount: number,
    maxViews: number | null | undefined
): boolean {
    if (!maxViews) return false;
    return viewCount >= maxViews;
}

/**
 * Generates the full share URL
 * @param token - Share token
 * @returns Complete share URL
 */
export function getShareUrl(token: string): string {
    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return `${baseUrl}/share/${token}`;
}

/**
 * Validates share token with comprehensive checks
 * @param token - Token to validate
 * @param expiresAt - Token expiration date
 * @param viewCount - Current view count  
 * @param maxViews - Maximum views allowed
 * @param revoked - Whether token is revoked
 * @returns Validation result with reason if invalid
 */
export function validateShareToken(
    token: string,
    expiresAt: Date | null | undefined,
    viewCount: number,
    maxViews: number | null | undefined,
    revoked: boolean = false
): { valid: boolean; reason?: string } {
    // Check format
    if (!validateShareTokenFormat(token)) {
        return { valid: false, reason: 'Invalid token format' };
    }

    // Check if revoked
    if (revoked) {
        return { valid: false, reason: 'Token has been revoked' };
    }

    // Check expiration
    if (isTokenExpired(expiresAt)) {
        return { valid: false, reason: 'Token has expired' };
    }

    // Check view limit
    if (isViewLimitReached(viewCount, maxViews)) {
        return { valid: false, reason: 'View limit exceeded' };
    }

    return { valid: true };
}
