import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { url } from 'sdk_automation';

test.describe('@accessibility Tests', () => {
  test('inventory page - WCAG 2.1 Level AA', async ({ page }) => {
    await page.goto(url.inventory);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto(url.inventory);

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute(
      'data-test',
      'add-to-cart-sauce-labs-backpack',
    );

    await page.keyboard.press('Enter');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('screen reader friendly', async ({ page }) => {
    await page.goto(url.inventory);

    const results = await new AxeBuilder({ page }).withTags(['cat.aria']).analyze();

    expect(results.violations).toEqual([]);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
  });

  test('should exclude third-party widgets', async ({ page }) => {
    await page.goto(url.inventory);

    const results = await new AxeBuilder({ page })
      .exclude('#google-ads')
      .exclude('.social-widget')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
