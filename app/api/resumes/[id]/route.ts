import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/resume";
import { auth } from "@clerk/nextjs/server";
import { updateResumeSchema, validateData } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Validate MongoDB ObjectId format
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 });
        }

        await dbConnect();

        // Security: Only allow users to access their own resumes
        const resume = await Resume.findOne({ _id: id, userId, isDeleted: false });

        if (!resume) {
            return NextResponse.json({ message: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json(resume);

    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching resume:', error);
        }
        return NextResponse.json(
            { message: "Failed to fetch resume. Please try again." },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Validate MongoDB ObjectId format
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 });
        }

        const body = await req.json();

        // Validate input
        const validation = validateData(updateResumeSchema, body);
        if (!validation.success) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[API] Validation failed:', validation.error);
                console.error('[API] Request body:', JSON.stringify(body, null, 2));
            }
            return NextResponse.json(
                { message: "Validation error", error: validation.error },
                { status: 400 }
            );
        }

        await dbConnect();

        const updatedResume = await Resume.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { $set: validation.data },
            { new: true }
        );

        if (!updatedResume) {
            return NextResponse.json(
                { message: "Resume not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedResume);

    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error updating resume:', error);
        }
        return NextResponse.json(
            { message: "Failed to update resume. Please try again." },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Validate MongoDB ObjectId format
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 });
        }

        await dbConnect();

        // Soft delete instead of hard delete
        const deletedResume = await Resume.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!deletedResume) {
            return NextResponse.json(
                { message: "Resume not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Resume deleted successfully"
        });

    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error deleting resume:', error);
        }
        return NextResponse.json(
            { message: "Failed to delete resume. Please try again." },
            { status: 500 }
        );
    }
}
