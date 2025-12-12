/**
 * Auth Middleware Helper
 * Eliminates duplicate auth checking code across API routes
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import logger from "./logger";

export interface AuthenticatedRequest {
    userId: string;
    requestId: string;
}

/**
 * Wrapper for protected API routes
 * Automatically handles authentication and request ID generation
 */
export async function withAuth<T>(
    handler: (req: NextRequest, auth: AuthenticatedRequest) => Promise<NextResponse<T>>
): Promise<(req: NextRequest, context?: any) => Promise<NextResponse>> {
    return async (req: NextRequest, context?: any) => {
        const requestId = nanoid(16);

        try {
            const { userId } = await auth();

            if (!userId) {
                logger.warn("Unauthorized request", {}, undefined, requestId);
                return NextResponse.json(
                    {
                        success: false,
                        error: "Unauthorized",
                        message: "Authentication required"
                    },
                    { status: 401 }
                );
            }

            return await handler(req, { userId, requestId });
        } catch (error: any) {
            logger.error("Auth middleware error", error, undefined, requestId);
            return NextResponse.json(
                {
                    success: false,
                    error: "Internal Server Error",
                    message: "An unexpected error occurred"
                },
                { status: 500 }
            );
        }
    };
}

/**
 * Simple auth check that returns userId or null
 */
export async function getAuthUser(): Promise<{ userId: string; requestId: string } | null> {
    const requestId = nanoid(16);
    try {
        const { userId } = await auth();
        if (!userId) return null;
        return { userId, requestId };
    } catch (error) {
        logger.error("Auth check failed", { error: error instanceof Error ? error.message : String(error) }, undefined, requestId);
        return null;
    }
}
