import { url, inventorySelectors } from "sdk/constants";
import { test, expect } from "../fixtures";

test.describe("Inventory Page Tests @regression", () => {
  test("E2E: Add all & Checkout", async ({
    inventoryPage,
    cartPage,
    checkOutPage,
    testUser,
  }) => {
    await inventoryPage.addAllVisibleInventoryItems();
    await inventoryPage.goToCart();

    const items = await cartPage.getAllItems();
    await expect(items).toHaveCount(inventorySelectors.length);

    await checkOutPage.navigateToCheckoutForm();
    await checkOutPage.fillCheckoutForm(testUser);

    await checkOutPage.checkUrl(url.checkoutStepTwo);
    await checkOutPage.finishCheckout();
  });

  test("should display all main UI elements", async ({ inventoryPage }) => {
    await inventoryPage.checkIsOnInventoryPage();
  });

  test("should add one product to cart", async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart("addToCartBackpack");
    await expect(cartPage.cartBadge).toHaveText("1");
  });

  test("should remove product from cart", async ({
    inventoryPage,
    cartPage,
  }) => {
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

  test("should navigate to cart", async ({ inventoryPage, page }) => {
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(url.cart);
  });
});
