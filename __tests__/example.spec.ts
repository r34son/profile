import { test, expect } from '@playwright/test';

test('should navigate to the docs page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/');
  // Find an element with the text 'Docs' and click on it
  await page.getByText('Docs').click();

  const docsPage = await page.waitForEvent('popup');
  // The new url should be "https://nextjs.org/docs"
  await expect(docsPage).toHaveURL(/https:\/\/nextjs\.org\/docs/);
});
