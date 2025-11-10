import { CartPage, CheckOutPage, LoginPage, InventoryPage } from "../pages";
import { inventoryTest as test, expect } from "../fixtures";
import { Browser, chromium } from "@playwright/test";
import { selectors, url, inventorySelectors } from "sdk/constants";
import { userService, assetsTracker } from "../services";
import { UserRole } from "sdk/interfaces";

let browser: Browser;
let cartPage: CartPage;
let checkOutPage: CheckOutPage;
let inventoryPage: InventoryPage;
let loginPage: LoginPage;

test.beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

test.afterAll(async () => {
  assetsTracker.cleanup({ users: true });
  await browser.close();
});

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.loginAs(UserRole.standard_user);
  inventoryPage = new InventoryPage(page);
  checkOutPage = new CheckOutPage(page);
  cartPage = new CartPage(page);
});

test.describe("Inventory Page Tests", () => {
  test("E2E: Add all & Checkout", async ({ page }) => {
    await inventoryPage.addAllVisibleInventoryItems();
    await page.click(selectors.cart.shoppingCartLink);
    await page.waitForURL(url.cart);
    await expect(page.locator(selectors.cart.inventory_item_name)).toHaveCount(
      inventorySelectors.length,
    );

    //*CheckOutStepOne
    const dammyUser = await userService.createUser(UserRole.standard_user);
    assetsTracker.track({ users: dammyUser._id });
    await checkOutPage.navigateToCheckoutForm();
    await checkOutPage.fillCheckoutForm(dammyUser);

    //*CheckOutStepTwo
    await page.waitForURL(url.checkoutStepTwo);
    await expect(page.locator(selectors.cart.inventory_item_name)).toHaveCount(
      inventorySelectors.length,
    );
    await page.click(selectors.checkout.finish);
    await page.waitForURL(url.checkoutComplete);
    await page.click(selectors.checkout.backToProductsBtn);
    await page.waitForURL(inventoryPage.pageUrl);
  });

  test("should display all main UI elements", async ({ page }) => {
    await expect(page.locator(selectors.inventory.pageTitle)).toHaveText(
      "Products",
    );
    await expect(page.locator(selectors.filter.sortDropdown)).toBeVisible();
    await expect(page.locator(selectors.cart.shoppingCartLink)).toBeVisible();
    await expect(page.locator(selectors.cart.inventory_item_name)).toHaveCount(
      6,
    );
  });

  test("should add one product to cart", async ({ page }) => {
    await page.waitForSelector(selectors.inventory.backpack);
    await page.click(selectors.inventory.backpack);
    await expect(page.locator(selectors.inventory.cartBadge)).toHaveText("1");
    await expect(page.locator(selectors.removeButtons.backpack)).toBeVisible();
  });

  test("should remove product from cart", async ({ page }) => {
    await page.click(selectors.inventory.backpack);
    await page.click(selectors.removeButtons.backpack);
    await expect(page.locator(selectors.inventory.cartBadge)).toBeHidden();
  });

  test("should sort items by price low→high", async ({ page }) => {
    await page.selectOption(
      selectors.filter.sortDropdown,
      selectors.filter.lowToHigh,
    );
    const prices = await page.$$eval(selectors.inventory.itemPrice, (els) =>
      els.map((e) => parseFloat(e.textContent.replace("$", ""))),
    );
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  test("should sort items by price high→low", async ({ page }) => {
    await page.selectOption(
      selectors.filter.sortDropdown,
      selectors.filter.highToLow,
    );
    const prices = await page.$$eval(selectors.inventory.itemPrice, (els) =>
      els.map((e) => parseFloat(e.textContent.replace("$", ""))),
    );
    expect([...prices].sort((a, b) => b - a)).toEqual(prices);
  });

  test("should sort items by name A→Z", async ({ page }) => {
    await page.selectOption(
      selectors.filter.sortDropdown,
      selectors.filter.nameAZ,
    );
    const names = await page.$$eval(selectors.inventory.itemName, (els) =>
      els.map((e) => e.textContent.trim().toLowerCase()),
    );
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
  });

  test("should sort items by name Z→A", async ({ page }) => {
    await page.selectOption(
      selectors.filter.sortDropdown,
      selectors.filter.nameZA,
    );
    const names = await page.$$eval(selectors.inventory.itemName, (els) =>
      els.map((e) => e.textContent.trim().toLowerCase()),
    );
    expect([...names].sort((a, b) => b.localeCompare(a))).toEqual(names);
  });

  test("should navigate to cart", async ({ page }) => {
    await page.click(selectors.cart.shoppingCartLink, { timeout: 10000 });
    await expect(page).toHaveURL(url.cart);
  });
});


test.describe("Inventory Page Tests", () => {

  test("E2E: Add all & Checkout", async ({ inventoryPage, cartPage, checkOutPage }) => {
    await inventoryPage.addAllVisibleInventoryItems();
    await inventoryPage.goToCart();
    const items = await cartPage.getAllItems();
    await expect(items).toHaveCount(inventorySelectors.length);

    //* CheckOut Step 1
    const dammyUser = await userService.createUser(UserRole.standard_user);
    assetsTracker.track({ users: dammyUser._id });
    await checkOutPage.navigateToCheckoutForm();
    await checkOutPage.fillCheckoutForm(dammyUser);

    //* CheckOut Step 2
    await checkOutPage.checkUrl(url.checkoutStepTwo);
    await checkOutPage.finishCheckout();

    await inventoryPage.checkIsOnInventoryPage();
  });

  test("should display all main UI elements", async ({ inventoryPage }) => {
    await inventoryPage.checkIsOnInventoryPage();
  });

  test("should add one product to cart", async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart("addToCartBackpack");
    await expect(cartPage.cartBadge).toHaveText("1");
    const removeBtn = await cartPage.getRemoveButton("removeBackpack");
    await expect(removeBtn).toBeVisible();
  });

  test("should remove product from cart", async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart("addToCartBackpack");
    await inventoryPage.removeProductFromCart("addToCartBackpack");
    await expect(cartPage.cartBadge).toBeHidden();
  });

  test("should sort items by price low→high", async ({ inventoryPage }) => {
    await inventoryPage.sortItems("priceLowToHigh");
    const prices = await inventoryPage.getAllPrices();
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  test("should sort items by price high→low", async ({ inventoryPage }) => {
    await inventoryPage.sortItems("priceHighToLow");
    const prices = await inventoryPage.getAllPrices();
    expect([...prices].sort((a, b) => b - a)).toEqual(prices);
  });

  test("should sort items by name A→Z", async ({ inventoryPage }) => {
    await inventoryPage.sortItems("nameAZ");
    const names = await inventoryPage.getAllNames();
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
  });

  test("should sort items by name Z→A", async ({ inventoryPage }) => {
    await inventoryPage.sortItems("nameZA");
    const names = await inventoryPage.getAllNames();
    expect([...names].sort((a, b) => b.localeCompare(a))).toEqual(names);
  });

  test("should navigate to cart", async ({ cartPage, inventoryPage }) => {
    await inventoryPage.goToCart();
    await expect(cartPage.page).toHaveURL(url.cart);
  });

});
