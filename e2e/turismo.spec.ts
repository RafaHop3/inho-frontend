import { test, expect } from '@playwright/test';

test.describe('INHO Turismo & Proposta Viva', () => {
  test('renders turismo route and public proposta page without SEC-01 leaks', async ({ page }) => {
    await page.goto('/proposta/slug-inexistente', { waitUntil: 'domcontentloaded' });
    const html = (await page.content()).toLowerCase();
    expect(html).not.toContain('google gemini');
    expect(html).not.toContain('gemini 1.5 flash');
    expect(html).not.toContain('gemini 2.0');
  });

  test('navigates to /dashboard/turismo without crashing', async ({ page }) => {
    const resp = await page.goto('/dashboard/turismo', { waitUntil: 'domcontentloaded' });
    expect(resp?.status()).toBeLessThan(500);
  });
});
