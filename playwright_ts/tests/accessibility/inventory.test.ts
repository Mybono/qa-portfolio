import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { url } from 'sdk/constants';

test('inventory page accessibility', async ({ page }) => {
  await page.goto(url.inventory);
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
