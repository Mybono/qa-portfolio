import { logger, url } from 'sdk_automation';
import { test, expect } from '@playwright/test';

test('page @load performance', async ({ page }) => {
  const startTime = Date.now();

  await page.goto(url.inventory);
  await page.waitForLoadState('domcontentloaded');

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
  const metrics = await page.evaluate(() =>
    JSON.stringify(performance.getEntriesByType('navigation')[0]),
  );

  logger.log(`Performance metrics: ${metrics}`);
});
