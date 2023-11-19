import { test, expect } from '@playwright/test';

test('screenshot /', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot();
});
