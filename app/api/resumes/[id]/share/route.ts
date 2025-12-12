import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/resume";
import { generateShareToken } from "@/lib/share-token";

// Enable sharing
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();
        const resume = await Resume.findById(id);

        if (!resume) {
            return NextResponse.json({ message: "Resume not found" }, { status: 404 });
        }

        if (resume.userId !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Generate share token if not exists
        if (!resume.shareToken) {
            const tokenData = generateShareToken();
            resume.shareToken = tokenData.token;
            resume.shareTokenExpiry = tokenData.expiresAt;
            resume.shareTokenMaxViews = tokenData.maxViews;
        }

        resume.shareEnabled = true;
        await resume.save();

        return NextResponse.json({
            shareToken: resume.shareToken,
            shareEnabled: resume.shareEnabled
        });

    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error("[API] Error enabling share:", error.message);
        }
        return NextResponse.json({
            message: "Failed to enable sharing"
        }, { status: 500 });
    }
}

// Disable sharing
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();
        const resume = await Resume.findById(id);

        if (!resume) {
            return NextResponse.json({ message: "Resume not found" }, { status: 404 });
        }

        if (resume.userId !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        resume.shareEnabled = false;
        await resume.save();

        return NextResponse.json({
            shareEnabled: resume.shareEnabled
        });

    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error("[API] Error disabling share:", error.message);
        }
        return NextResponse.json({
            message: "Failed to disable sharing"
        }, { status: 500 });
    }
}
