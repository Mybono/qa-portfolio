import { Browser, BrowserContext, Page, test, expect, chromium } from '@playwright/test';
import { login, trackCreatedAssets, deleteTrackedAssets } from '../utils';
import { selectors, url, inventorySelectors } from '../constants';
import { userService } from '../services';
import { UserRole } from '../interfaces';
let browser: Browser;

test.beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

test.afterAll(async () => {
  deleteTrackedAssets({ users: true })
  await browser.close();
});

test.describe('Inventory Tests as standard_user', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    context = await browser.newContext();
    page = await context.newPage();
    await login(page, UserRole.standard_user);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('E2E: Add all & Checkout', async () => {
    await page.goto(url.inventory);
    for (const selector of inventorySelectors) {
      await page.locator(selector).click();
    }
    await page.click(selectors.cart.shoppingCartLink);
    await page.waitForURL(url.cart);
    await expect(page.locator(selectors.cart.inventory_item_name)).toHaveCount(inventorySelectors.length);
    await page.click(selectors.cart.checkoutBtn);

    //*CheckOutStepOne
    await page.waitForURL(url.checkoutStepOne);
    const standardUser = await userService.createUser();
    trackCreatedAssets({ users: standardUser._id });
    await page.fill(selectors.checkout.firstName, standardUser.firstName);
    await page.fill(selectors.checkout.lastName, standardUser.lastName);
    await page.fill(selectors.checkout.postalCode, standardUser.postalCode);
    await page.click(selectors.checkout.continueBtn);

    //*CheckOutStepTwo
    await page.waitForURL(url.checkoutStepTwo);
    await expect(page.locator(selectors.cart.inventory_item_name)).toHaveCount(inventorySelectors.length);
    await page.click(selectors.checkout.finish);
    await page.waitForURL(url.checkoutComplete);
    await page.click(selectors.checkout.backToProductsBtn);
    await page.waitForURL(url.inventory);
  })
})
