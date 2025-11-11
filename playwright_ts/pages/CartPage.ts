import { BasePage, InventoryPage } from "../pages";
import { Page, Locator } from "@playwright/test";
import { url } from "@mybono/sdk_automation";


export class CartPage extends BasePage {
  static readonly selectors = {
    shoppingCartLink: '[data-test="shopping-cart-link"]',
    continueShopping: '[data-test="continue-shopping"]',
    checkoutBtn: '[data-test="checkout"]',
    inventory_item_price: '[data-test="inventory-item-price"]',
    inventory_item_name: '[data-test="inventory-item-name"]',
    cartBadge: '[data-test="shopping-cart-badge"]',
  };

  readonly page: Page;
  readonly pageUrl = url.cart;

  readonly shoppingCartLink: Locator;
  readonly continueShopping: Locator;
  readonly checkoutBtn: Locator;
  readonly inventory_item_price: Locator;
  readonly inventory_item_name: Locator;
  readonly cartBadge: Locator;

  readonly removeBackpack: Locator;
  readonly removeBikeLight: Locator;
  readonly removeBoltTShirt: Locator;
  readonly removeFleeceJacket: Locator;
  readonly removeOnesie: Locator;
  readonly removeRedShirt: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.shoppingCartLink = page.locator(CartPage.selectors.shoppingCartLink);
    this.continueShopping = page.locator(CartPage.selectors.continueShopping);
    this.checkoutBtn = page.locator(CartPage.selectors.checkoutBtn);
    this.inventory_item_price = page.locator(
      CartPage.selectors.inventory_item_price,
    );
    this.inventory_item_name = page.locator(
      CartPage.selectors.inventory_item_name,
    );
    this.cartBadge = page.locator(CartPage.selectors.cartBadge);

    this.removeBackpack = page.locator(InventoryPage.selectors.removeBackpack);
    this.removeBikeLight = page.locator(
      InventoryPage.selectors.removeBikeLight,
    );
    this.removeBoltTShirt = page.locator(
      InventoryPage.selectors.removeBoltTShirt,
    );
    this.removeFleeceJacket = page.locator(
      InventoryPage.selectors.removeFleeceJacket,
    );
    this.removeOnesie = page.locator(InventoryPage.selectors.removeOnesie);
    this.removeRedShirt = page.locator(InventoryPage.selectors.removeRedShirt);
  }

  async removeProduct(
    product: keyof Pick<
      typeof InventoryPage.selectors,
      | "removeBackpack"
      | "removeBikeLight"
      | "removeBoltTShirt"
      | "removeFleeceJacket"
      | "removeOnesie"
      | "removeRedShirt"
    >,
  ) {
    const removeLocator = (this as any)[product] as Locator;
    if (removeLocator) await removeLocator.click();
  }

  async getRemoveButton(
    product: keyof Pick<
      typeof InventoryPage.selectors,
      | "removeBackpack"
      | "removeBikeLight"
      | "removeBoltTShirt"
      | "removeFleeceJacket"
      | "removeOnesie"
      | "removeRedShirt"
    >,
  ): Promise<Locator> {
    return this.page.locator(InventoryPage.selectors[product]);
  }

  async goToCheckout() {
    await this.checkoutBtn.click();
    await this.page.waitForURL(url.checkoutStepOne);
  }

  async getAllItems() {
    return this.page.locator(InventoryPage.selectors.inventoryItemName);
  }
}
