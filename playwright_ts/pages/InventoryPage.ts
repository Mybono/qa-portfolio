import { expect, Page } from "@playwright/test";
import { BasePage } from "../pages";
import { url } from "sdk/constants";

export class InventoryPage extends BasePage {
  static readonly selectors = {
    addToCartBackpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
    addToCartBikeLight: '[data-test="add-to-cart-sauce-labs-bike-light"]',
    addToCartBoltTShirt: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
    addToCartFleeceJacket: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
    addToCartOnesie: '[data-test="add-to-cart-sauce-labs-onesie"]',
    addToCartRedShirt:
      '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]',

    removeBackpack: '[data-test="remove-sauce-labs-backpack"]',
    removeBikeLight: '[data-test="remove-sauce-labs-bike-light"]',
    removeBoltTShirt: '[data-test="remove-sauce-labs-bolt-t-shirt"]',
    removeFleeceJacket: '[data-test="remove-sauce-labs-fleece-jacket"]',
    removeOnesie: '[data-test="remove-sauce-labs-onesie"]',
    removeRedShirt:
      '[data-test="remove-test.allthethings()-t-shirt-(red)"]',

    inventoryList: '[data-test="inventory-list"]',
    pageTitle: '[data-test="title"]',
    shoppingCartLink: '[data-test="shopping-cart-link"]',
    cartBadge: '[data-test="shopping-cart-badge"]',
    inventoryItemName: '[data-test="inventory-item-name"]',
    inventoryItemPrice: '[data-test="inventory-item-price"]',
    sortDropdown: 'select[data-test="product_sort_container"]',
  };

  readonly page: Page;

  readonly pageTitle;
  readonly inventoryList;
  readonly shoppingCartLink;
  readonly cartBadge;
  readonly inventoryItemName;
  readonly inventoryItemPrice;
  readonly sortDropdown;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.pageTitle = page.locator(InventoryPage.selectors.pageTitle);
    this.inventoryList = page.locator(InventoryPage.selectors.inventoryList);
    this.shoppingCartLink = page.locator(
      InventoryPage.selectors.shoppingCartLink
    );
    this.cartBadge = page.locator(InventoryPage.selectors.cartBadge);
    this.inventoryItemName = page.locator(
      InventoryPage.selectors.inventoryItemName
    );
    this.inventoryItemPrice = page.locator(
      InventoryPage.selectors.inventoryItemPrice
    );
    this.sortDropdown = page.locator(InventoryPage.selectors.sortDropdown);
  }

  // ==========================
  // Page Assertions / Checks
  // ==========================
  async checkIsOnInventoryPage() {
    await expect(this.page).toHaveURL(new RegExp(url.inventory));
    await expect(this.pageTitle).toHaveText("Products");
    await expect(this.sortDropdown).toBeVisible();
    await expect(this.shoppingCartLink).toBeVisible();
    await expect(this.inventoryList).toBeVisible();
  }

  // ==========================
  // Actions
  // ==========================
  async addProductToCart(productLocator: keyof typeof InventoryPage.selectors) {
    const locator = this.page.locator(InventoryPage.selectors[productLocator]);
    await locator.click();
  }

  async removeProductFromCart(productLocator: keyof typeof InventoryPage.selectors) {
    const locator = this.page.locator(InventoryPage.selectors[productLocator]);
    await locator.click();
  }

  async addAllVisibleInventoryItems() {
    for (const key of Object.keys(InventoryPage.selectors)) {
      if (key.startsWith("addToCart")) {
        const locator = this.page.locator(InventoryPage.selectors[key as keyof typeof InventoryPage.selectors]);
        if (await locator.isVisible()) {
          await locator.click();
        }
      }
    }
  }

  async sortItems(option: 'priceLowToHigh' | 'priceHighToLow' | 'nameAZ' | 'nameZA') {
    const mapping = {
      priceLowToHigh: "lohi",
      priceHighToLow: "hilo",
      nameAZ: "az",
      nameZA: "za",
    };
    await this.sortDropdown.selectOption(mapping[option]);
  }

  async getAllPrices(): Promise<number[]> {
    return await this.inventoryItemPrice.evaluateAll(
      els => els.map(el => parseFloat(el.textContent.replace('$', '').trim()))
    );
  }

  async getAllNames(): Promise<string[]> {
    return await this.inventoryItemName.evaluateAll(
      els => els.map(el => el.textContent.trim().toLowerCase())
    );
  }

  async goToCart() {
    await this.shoppingCartLink.click();
    await this.page.waitForURL(/cart/);
  }
}
