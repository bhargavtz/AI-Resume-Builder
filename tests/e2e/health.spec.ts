import { test, expect } from '@playwright/test';

test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('ai-resume-builder');
});

test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Resume Builder|Resume/i);
});
