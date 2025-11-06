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

test.beforeEach(async ({ page }) => {
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

  test('should display all main UI elements', async ({ page }) => {
    await expect(page.locator(selectors.inventory.pageTitle)).toHaveText('Products');
    await expect(page.locator(selectors.filter.sortDropdown)).toBeVisible();
    await expect(page.locator(selectors.cart.shoppingCartLink)).toBeVisible();
    await expect(page.locator(selectors.cart.inventory_item_name)).toHaveCount(6);
  });

  test('should add one product to cart', async ({ page }) => {
    await page.click(selectors.inventory.backpack);
    await expect(page.locator(selectors.inventory.cartBadge)).toHaveText('1');
    await expect(page.locator(selectors.inventory.backpack)).toBeVisible();
  });

  test('should remove product from cart', async ({ page }) => {
    await page.click(selectors.inventory.backpack);
    await page.click(selectors.removeButtons.backpack);
    await expect(page.locator(selectors.inventory.cartBadge)).toBeHidden();
  });

  test('should sort items by price low→high', async ({ page }) => {
    await page.selectOption(selectors.filter.sortDropdown, selectors.filter.lowToHigh);
    const prices = await page.$$eval(selectors.inventory.itemPrice, els => els.map(e => parseFloat(e.textContent.replace('$', ''))));
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  test('should sort items by price high→low', async ({ page }) => {
    await page.selectOption(selectors.filter.sortDropdown, selectors.filter.highToLow);
    const prices = await page.$$eval(
      selectors.inventory.itemPrice,
      els => els.map(e => parseFloat(e.textContent.replace('$', '')))
    );
    expect([...prices].sort((a, b) => b - a)).toEqual(prices);
  });

  test('should sort items by name A→Z', async ({ page }) => {
    await page.selectOption(selectors.filter.sortDropdown, selectors.filter.nameAZ);
    const names = await page.$$eval(
      selectors.inventory.itemName,
      els => els.map(e => e.textContent.trim().toLowerCase())
    );
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
  });

  test('should sort items by name Z→A', async ({ page }) => {
    await page.selectOption(selectors.filter.sortDropdown, selectors.filter.nameZA);
    const names = await page.$$eval(
      selectors.inventory.itemName,
      els => els.map(e => e.textContent.trim().toLowerCase())
    );
    expect([...names].sort((a, b) => b.localeCompare(a))).toEqual(names);
  });

  test('should navigate to cart', async ({ page }) => {
    await page.click(selectors.cart.shoppingCartLink);
    await expect(page).toHaveURL(url.cart);
  });
})
