import { describe, expect, it } from 'vitest';
import { sanitizeForAI, sanitizeJobTitle, sanitizeArray } from '@/lib/sanitize';

describe('sanitize', () => {
    it('strips script tags from AI input', () => {
        const result = sanitizeForAI('<script>alert(1)</script>Hello', 100);
        expect(result).not.toContain('<script>');
        expect(result).toContain('Hello');
    });

    it('trims and limits job titles', () => {
        expect(sanitizeJobTitle('  Engineer  ')).toBe('Engineer');
    });

    it('sanitizes string arrays', () => {
        expect(sanitizeArray(['React', '<b>Node</b>'])).toEqual(['React', 'Node']);
    });
});
