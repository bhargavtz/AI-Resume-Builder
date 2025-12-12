import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/resume";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
    try {
        await dbConnect();
        const { token } = await params;

        const resume = await Resume.findOne({
            shareToken: token,
            shareEnabled: true,
            isDeleted: false
        });

        if (!resume) {
            return NextResponse.json(
                { message: "Resume not found or sharing is disabled" },
                { status: 404 }
            );
        }

        // Track view
        resume.analytics.views = (resume.analytics.views || 0) + 1;
        resume.analytics.lastViewed = new Date();
        await resume.save();

        // Return only necessary data (no sensitive info)
        return NextResponse.json({
            content: resume.content,
            themeColor: resume.themeColor,
            templateId: resume.templateId,
            title: resume.title
        });

    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error("[API] Error fetching shared resume:", error.message);
        }
        return NextResponse.json({
            message: "Failed to fetch resume"
        }, { status: 500 });
    }
}
