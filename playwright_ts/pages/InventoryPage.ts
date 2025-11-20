import { env, url } from 'sdk_automation';
import { expect, Page } from '@playwright/test';
import { BasePage } from '../pages';

export class InventoryPage extends BasePage {
  static readonly selectors = {
    addToCartBackpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
    addToCartBikeLight: '[data-test="add-to-cart-sauce-labs-bike-light"]',
    addToCartBoltTShirt: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
    addToCartFleeceJacket: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
    addToCartOnesie: '[data-test="add-to-cart-sauce-labs-onesie"]',
    addToCartRedShirt: '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]',

    removeBackpack: '[data-test="remove-sauce-labs-backpack"]',
    removeBikeLight: '[data-test="remove-sauce-labs-bike-light"]',
    removeBoltTShirt: '[data-test="remove-sauce-labs-bolt-t-shirt"]',
    removeFleeceJacket: '[data-test="remove-sauce-labs-fleece-jacket"]',
    removeOnesie: '[data-test="remove-sauce-labs-onesie"]',
    removeRedShirt: '[data-test="remove-test.allthethings()-t-shirt-(red)"]',

    inventoryList: '[data-test="inventory-list"]',
    pageTitle: '[data-test="title"]',
    shoppingCartLink: '[data-test="shopping-cart-link"]',
    cartBadge: '[data-test="shopping-cart-badge"]',
    inventoryItemName: '[data-test="inventory-item-name"]',
    inventoryItemPrice: '[data-test="inventory-item-price"]',
    sortDropdown: 'select[data-test="product-sort-container"]',
    logoutLink: '[data-test="logout-sidebar-link"]',
    burgerMenu: '[data-test="open-menu"]',
  };

  readonly page: Page;
  readonly pageUrl;
  readonly pageTitle;
  readonly inventoryList;
  readonly shoppingCartLink;
  readonly cartBadge;
  readonly inventoryItemName;
  readonly inventoryItemPrice;
  readonly sortDropdown;
  readonly inventoryItems;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.pageUrl = url.inventory;
    this.pageTitle = page.locator(InventoryPage.selectors.pageTitle);
    this.inventoryList = page.locator(InventoryPage.selectors.inventoryList);
    this.shoppingCartLink = page.locator(InventoryPage.selectors.shoppingCartLink);
    this.cartBadge = page.locator(InventoryPage.selectors.cartBadge);
    this.inventoryItemName = page.locator(InventoryPage.selectors.inventoryItemName);
    this.inventoryItemPrice = page.locator(InventoryPage.selectors.inventoryItemPrice);
    this.sortDropdown = page.locator(InventoryPage.selectors.sortDropdown);

    this.inventoryItems = [
      InventoryPage.selectors.addToCartBackpack,
      InventoryPage.selectors.addToCartBikeLight,
      InventoryPage.selectors.addToCartBoltTShirt,
      InventoryPage.selectors.addToCartFleeceJacket,
      InventoryPage.selectors.addToCartOnesie,
      InventoryPage.selectors.addToCartRedShirt,
    ];
  }

  // ==========================
  // Page Assertions / Checks
  // ==========================
  async checkIsOnInventoryPage(): Promise<void> {
    await expect.soft(this.page).toHaveURL(new RegExp(url.inventory));
    await expect.soft(this.pageTitle).toHaveText('Products');
    await expect.soft(this.sortDropdown).toBeVisible();
    await expect.soft(this.shoppingCartLink).toBeVisible();
    await expect.soft(this.inventoryList).toBeVisible();
  }

  // ==========================
  // Actions
  // ==========================
  async addAllVisibleInventoryItems(): Promise<void> {
    try {
      await this.checkIsOnInventoryPage();
      for (const selector of this.inventoryItems) {
        const item = this.page.locator(selector);
        if (await item.isVisible()) {
          await item.click();
        }
      }
    } catch (error) {
      throw new Error(`[addAllVisibleInventoryItems]: ${error}`);
    }
  }

  async addProductToCart(productLocator: keyof typeof InventoryPage.selectors): Promise<void> {
    try {
      const locator = this.page.locator(InventoryPage.selectors[productLocator]);
      await locator.waitFor({ state: 'visible', timeout: env.TIMEOUT });
      await locator.click();
    } catch (error) {
      throw new Error(`[addProductToCart]: ${error}`);
    }
  }

  async removeProductFromCart(productLocator: keyof typeof InventoryPage.selectors) {
    try {
      const locator = this.page.locator(InventoryPage.selectors[productLocator]);
      await locator.waitFor({ state: 'visible', timeout: env.TIMEOUT });
      await locator.click();
    } catch (error) {
      throw new Error(`[removeProductFromCart]: ${error}`);
    }
  }

  async sortItems(
    option: 'priceLowToHigh' | 'priceHighToLow' | 'nameAZ' | 'nameZA',
  ): Promise<void> {
    try {
      const mapping = {
        priceLowToHigh: 'lohi',
        priceHighToLow: 'hilo',
        nameAZ: 'az',
        nameZA: 'za',
      };
      await this.page.waitForURL(url.inventory);
      await this.sortDropdown.waitFor({
        state: 'visible',
        timeout: env.TIMEOUT,
      });
      await this.sortDropdown.selectOption(mapping[option]);
    } catch (error) {
      throw new Error(`[sortItems]: ${error}`);
    }
  }

  async getAllPrices(): Promise<number[]> {
    return await this.inventoryItemPrice.evaluateAll(els =>
      els.map(el => parseFloat(el.textContent.replace('$', '').trim())),
    );
  }

  async getAllNames(): Promise<string[]> {
    return await this.inventoryItemName.evaluateAll(els =>
      els.map(el => el.textContent.trim().toLowerCase()),
    );
  }

  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
    await this.page.waitForURL(/cart/);
  }
}
