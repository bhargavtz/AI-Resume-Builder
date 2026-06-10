import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AI } from '@/lib/constants';

let googleProvider: ReturnType<typeof createGoogleGenerativeAI> | null = null;

export function getGoogleModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    if (!googleProvider) {
        googleProvider = createGoogleGenerativeAI({ apiKey });
    }

    return googleProvider(AI.GEMINI_MODEL);
}
