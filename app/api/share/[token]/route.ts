import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/resume";
import { validateShareToken } from "@/lib/share-token";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
    try {
        await dbConnect();
        const { token } = await params;

        const resume = await Resume.findOne({
            shareToken: token,
            shareEnabled: true,
            isDeleted: false,
        });

        if (!resume) {
            return NextResponse.json(
                { message: "Resume not found or sharing is disabled" },
                { status: 404 }
            );
        }

        const validation = validateShareToken(
            token,
            resume.shareTokenExpiry,
            resume.analytics?.views || 0,
            resume.shareTokenMaxViews,
            resume.shareTokenRevoked
        );

        if (!validation.valid) {
            return NextResponse.json(
                { message: validation.reason || "Share link is no longer valid" },
                { status: 403 }
            );
        }

        resume.analytics.views = (resume.analytics.views || 0) + 1;
        resume.analytics.lastViewed = new Date();
        await resume.save();

        return NextResponse.json({
            content: resume.content,
            themeColor: resume.themeColor,
            templateId: resume.templateId,
            title: resume.title,
        });
    } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
            console.error("[API] Error fetching shared resume:", error);
        }
        return NextResponse.json({
            message: "Failed to fetch resume",
        }, { status: 500 });
    }
}
