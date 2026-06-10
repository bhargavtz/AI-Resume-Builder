import { describe, expect, it } from 'vitest';
import {
    generateShareToken,
    isTokenExpired,
    isViewLimitReached,
    validateShareToken,
    validateShareTokenFormat,
} from '@/lib/share-token';

describe('share-token', () => {
    it('generates valid token format', () => {
        const token = generateShareToken(7);
        expect(validateShareTokenFormat(token.token)).toBe(true);
        expect(token.expiresAt.getTime()).toBeGreaterThan(token.createdAt.getTime());
    });

    it('detects expired tokens', () => {
        const past = new Date(Date.now() - 1000);
        expect(isTokenExpired(past)).toBe(true);
    });

    it('detects view limit reached', () => {
        expect(isViewLimitReached(5, 5)).toBe(true);
        expect(isViewLimitReached(3, 5)).toBe(false);
    });

    it('rejects revoked tokens', () => {
        const token = generateShareToken();
        const result = validateShareToken(token.token, token.expiresAt, 0, undefined, true);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Token has been revoked');
    });
});
