import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Resume from "@/lib/models/resume";
import { auth } from "@clerk/nextjs/server";
import { createResumeSchema, validateData } from "@/lib/validation";
import { successResponse, errorResponse, ErrorCodes, handleApiError } from "@/lib/api-error";
import { nanoid } from "nanoid";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();

        if (!userId) {
            return errorResponse("Unauthorized", ErrorCodes.UNAUTHORIZED, 401);
        }

        const body = await req.json();

        // Validate input
        const validation = validateData(createResumeSchema, body);
        if (!validation.success) {
            return errorResponse(
                "Validation error",
                ErrorCodes.VALIDATION_ERROR,
                400,
                { errors: validation.error }
            );
        }

        await dbConnect();

        const newResume = await Resume.create({
            title: validation.data.title,
            userId,
            content: {},
        });

        logger.info("Resume created", { resumeId: newResume._id }, userId, requestId);

        return successResponse(newResume, "Resume created successfully");

    } catch (error) {
        return handleApiError(error, undefined, requestId);
    }
}

export async function GET(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        const { userId } = await auth();

        if (!userId) {
            return errorResponse("Unauthorized", ErrorCodes.UNAUTHORIZED, 401);
        }

        // Get query parameters
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50
        const skip = (page - 1) * limit;

        // Filtering parameters
        const status = searchParams.get('status'); // draft, complete, archived
        const search = searchParams.get('search'); // Search in title
        const sortBy = searchParams.get('sortBy') || 'recent'; // recent, alphabetical, created

        await dbConnect();

        // Build query
        const query: any = {
            userId,
            isDeleted: false
        };

        // Add status filter
        if (status && ['draft', 'complete', 'archived'].includes(status)) {
            query.status = status;
        }

        // Add search filter
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Determine sort order
        let sortOption: any = { updatedAt: -1 }; // Default: recent
        if (sortBy === 'alphabetical') {
            sortOption = { title: 1 };
        } else if (sortBy === 'created') {
            sortOption = { createdAt: -1 };
        }

        // Get total count for pagination metadata
        const total = await Resume.countDocuments(query);

        // Fetch paginated resumes
        const resumes = await Resume.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .select('-__v') // Exclude version key
            .lean();

        logger.info("Resumes fetched", {
            count: resumes.length,
            filters: { status, search, sortBy }
        }, userId, requestId);

        return successResponse({
            resumes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + resumes.length < total
            },
            filters: {
                status: status || 'all',
                search: search || '',
                sortBy
            }
        });

    } catch (error) {
        return handleApiError(error, undefined, requestId);
    }
}
