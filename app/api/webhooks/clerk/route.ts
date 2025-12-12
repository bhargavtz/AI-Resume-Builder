/**
 * Clerk Webhook Handler
 * Handles user lifecycle events from Clerk
 */

import { NextRequest } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-error';
import logger from '@/lib/logger';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    const requestId = nanoid(16);

    try {
        // Get webhook secret from environment
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webhookSecret) {
            logger.error('Clerk webhook secret not configured', {}, undefined, requestId);
            return errorResponse(
                'Webhook not configured',
                ErrorCodes.INTERNAL_ERROR,
                500
            );
        }

        // Get headers
        const svix_id = req.headers.get('svix-id');
        const svix_timestamp = req.headers.get('svix-timestamp');
        const svix_signature = req.headers.get('svix-signature');

        if (!svix_id || !svix_timestamp || !svix_signature) {
            logger.warn('Missing webhook headers', {}, undefined, requestId);
            return errorResponse(
                'Missing webhook headers',
                ErrorCodes.INVALID_INPUT,
                400
            );
        }

        // Get body
        const payload = await req.json();
        const body = JSON.stringify(payload);

        // Verify webhook signature
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            logger.error('Webhook signature verification failed', { error: err }, undefined, requestId);
            return errorResponse(
                'Invalid signature',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }

        // Handle different event types
        const eventType = evt.type;

        switch (eventType) {
            case 'user.created':
                logger.info('User created', { userId: evt.data.id }, evt.data.id, requestId);
                // TODO: Create user profile in database if needed
                break;

            case 'user.updated':
                logger.info('User updated', { userId: evt.data.id }, evt.data.id, requestId);
                // TODO: Update user profile in database if needed
                break;

            case 'user.deleted':
                logger.info('User deleted', { userId: evt.data.id }, evt.data.id, requestId);
                // TODO: Handle user deletion (soft delete resumes, etc.)
                break;

            default:
                logger.debug('Unhandled webhook event', { eventType }, undefined, requestId);
        }

        return successResponse({ received: true }, 'Webhook processed successfully');

    } catch (error) {
        logger.error('Webhook processing error', { error }, undefined, requestId);
        return errorResponse(
            'Webhook processing failed',
            ErrorCodes.INTERNAL_ERROR,
            500
        );
    }
}
