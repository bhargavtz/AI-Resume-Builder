import { describe, expect, it } from 'vitest';
import { escapeRegex } from '@/lib/escape-regex';

describe('escapeRegex', () => {
    it('escapes regex special characters', () => {
        expect(escapeRegex('hello.*world')).toBe('hello\\.\\*world');
        expect(escapeRegex('(test)+')).toBe('\\(test\\)\\+');
    });

    it('leaves plain strings unchanged', () => {
        expect(escapeRegex('software engineer')).toBe('software engineer');
    });
});
