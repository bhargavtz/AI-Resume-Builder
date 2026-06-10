/**
 * Normalizes AI request fields that may arrive as strings or structured arrays from forms.
 */

export function experienceToText(experience: unknown): string {
    if (Array.isArray(experience)) {
        return experience
            .map((exp: { title?: string; companyName?: string }) => {
                const title = exp.title || '';
                const company = exp.companyName || '';
                return `${title}${company ? ` at ${company}` : ''}`;
            })
            .filter(Boolean)
            .join('. ');
    }
    return String(experience || '');
}

export function skillsToText(skills: unknown): string {
    if (Array.isArray(skills)) {
        return skills
            .map((skill: { name?: string } | string) =>
                typeof skill === 'string' ? skill : skill.name
            )
            .filter(Boolean)
            .join(', ');
    }
    return String(skills || '');
}
