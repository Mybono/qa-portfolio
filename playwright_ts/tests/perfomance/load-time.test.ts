import { test, expect } from "@playwright/test";
import { url } from "sdk/constants";
import { logger } from "sdk/utils";

test("page @load performance", async ({ page }) => {
  const startTime = Date.now();

  await page.goto(url.inventory);
  await page.waitForLoadState("networkidle");

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
  const metrics = await page.evaluate(() =>
    JSON.stringify(performance.getEntriesByType("navigation")[0]),
  );

  logger.log(`Performance metrics: ${metrics}`);
});
