/**
 * Input Sanitization Utilities
 * Prevents injection attacks and ensures clean user input
 */

/**
 * Sanitize text input for AI prompts
 * Removes potentially harmful content while preserving meaning
 */
export function sanitizeForAI(input: string, maxLength: number = 2000): string {
    if (!input) return '';

    return input
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script tags and content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Limit consecutive newlines
        .replace(/\n{3,}/g, '\n\n')
        // Remove null bytes
        .replace(/\0/g, '')
        // Trim whitespace
        .trim()
        // Limit length
        .slice(0, maxLength);
}

/**
 * Sanitize job title input
 */
export function sanitizeJobTitle(title: string): string {
    if (!title) return '';

    return title
        .replace(/<[^>]*>/g, '')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, 100);
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
    if (!email) return '';

    return email
        .toLowerCase()
        .trim()
        .slice(0, 254); // Max email length per RFC
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '';

    // Remove dangerous protocols
    const cleaned = url.trim();
    if (cleaned.match(/^(javascript|data|vbscript):/i)) {
        return '';
    }

    return cleaned.slice(0, 2048); // Max URL length
}

/**
 * Sanitize general text input
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
    if (!text) return '';

    return text
        .replace(/<[^>]*>/g, '')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, maxLength);
}

/**
 * Sanitize array of strings
 */
export function sanitizeArray(arr: string[], maxLength: number = 50): string[] {
    if (!Array.isArray(arr)) return [];

    return arr
        .filter(item => typeof item === 'string')
        .map(item => sanitizeText(item, 100))
        .filter(item => item.length > 0)
        .slice(0, maxLength);
}

/**
 * Sanitize resume content object
 * Recursively sanitizes all string fields
 */
export function sanitizeResumeContent(content: any): any {
    if (!content || typeof content !== 'object') return {};

    const sanitized: any = {};

    for (const [key, value] of Object.entries(content)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeText(value, 2000);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item => {
                if (typeof item === 'string') {
                    return sanitizeText(item);
                } else if (typeof item === 'object') {
                    return sanitizeResumeContent(item);
                }
                return item;
            });
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeResumeContent(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Validate and sanitize hex color
 */
export function sanitizeColor(color: string): string {
    if (!color) return '#3b82f6'; // Default blue

    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexPattern.test(color)) {
        return color;
    }

    return '#3b82f6'; // Default if invalid
}

/**
 * Remove excessive whitespace
 */
export function normalizeWhitespace(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Escape special characters for safe display
 */
export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, char => map[char]);
}
