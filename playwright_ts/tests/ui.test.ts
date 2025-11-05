import { Browser, BrowserContext, Page, test, expect, chromium } from '@playwright/test';
import { UserRole } from '../interfaces';
import { selectors, url } from '../constants';
import { loginAs } from '../utils';

let browser: Browser;

test.beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

test.afterAll(async () => {
  await browser.close();
});

test.describe('Inventory Tests as standard_user', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    context = await browser.newContext();
    page = await context.newPage();
    await loginAs(page, UserRole.standard_user);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Buy all', async () => {
    await page.goto(url.inventory);
    await page.locator('.inventory_item button').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
