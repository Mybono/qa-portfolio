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

    inventoryList: '[data-test="inventory-list"]',
    pageTitle: '[data-test="title"]',

    shoppingCartLink: '[data-test="shopping-cart-link"]',
    cartBadge: '[data-test="shopping-cart-badge"]',
    checkoutButton: '[data-test="checkout"]',
    continueButton: '[data-test="continue"]',
    finishButton: '[data-test="finish"]',
    backToProductsButton: '[data-test="back-to-products"]',
    completeHeader: '[data-test="checkout_complete_container"] h2',
    inventoryItemName: '[data-test="inventory-item-name"]',
    inventoryItemPrice: '[data-test="inventory-item-price"]',

    menuButton: "#react-burger-menu-btn",
    logoutLink: '[data-test="logout-sidebar-link"]',
    burgerMenu: '[data-test="open-menu"]',

    sortDropdown: 'select[data-test="product_sort_container"]',
  };

  readonly page: Page;
  readonly pageUrlFragment = url.inventory;

  readonly addToCartBackpack;
  readonly addToCartBikeLight;
  readonly addToCartBoltTShirt;
  readonly addToCartFleeceJacket;
  readonly addToCartOnesie;
  readonly addToCartRedShirt;

  readonly inventoryItems;

  readonly inventoryList;
  readonly pageTitle;

  readonly shoppingCartLink;
  readonly cartBadge;
  readonly checkoutButton;
  readonly continueButton;
  readonly finishButton;
  readonly backToProductsButton;
  readonly completeHeader;
  readonly inventoryItemName;
  readonly inventoryItemPrice;

  readonly menuButton;
  readonly logoutLink;
  readonly burgerMenu;

  readonly sortDropdown;
  readonly sortLowToHigh = "lohi";
  readonly sortHighToLow = "hilo";
  readonly sortNameAZ = "az";
  readonly sortNameZA = "za";

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.addToCartBackpack = page.locator(
      InventoryPage.selectors.addToCartBackpack,
    );
    this.addToCartBikeLight = page.locator(
      InventoryPage.selectors.addToCartBikeLight,
    );
    this.addToCartBoltTShirt = page.locator(
      InventoryPage.selectors.addToCartBoltTShirt,
    );
    this.addToCartFleeceJacket = page.locator(
      InventoryPage.selectors.addToCartFleeceJacket,
    );
    this.addToCartOnesie = page.locator(
      InventoryPage.selectors.addToCartOnesie,
    );
    this.addToCartRedShirt = page.locator(
      InventoryPage.selectors.addToCartRedShirt,
    );

    this.inventoryItems = [
      this.addToCartBackpack,
      this.addToCartBikeLight,
      this.addToCartBoltTShirt,
      this.addToCartFleeceJacket,
      this.addToCartOnesie,
      this.addToCartRedShirt,
    ];

    this.inventoryList = page.locator(InventoryPage.selectors.inventoryList);
    this.pageTitle = page.locator(InventoryPage.selectors.pageTitle);

    this.shoppingCartLink = page.locator(
      InventoryPage.selectors.shoppingCartLink,
    );
    this.cartBadge = page.locator(InventoryPage.selectors.cartBadge);
    this.checkoutButton = page.locator(InventoryPage.selectors.checkoutButton);
    this.continueButton = page.locator(InventoryPage.selectors.continueButton);
    this.finishButton = page.locator(InventoryPage.selectors.finishButton);
    this.backToProductsButton = page.locator(
      InventoryPage.selectors.backToProductsButton,
    );
    this.completeHeader = page.locator(InventoryPage.selectors.completeHeader);
    this.inventoryItemName = page.locator(
      InventoryPage.selectors.inventoryItemName,
    );
    this.inventoryItemPrice = page.locator(
      InventoryPage.selectors.inventoryItemPrice,
    );

    this.menuButton = page.locator(InventoryPage.selectors.menuButton);
    this.logoutLink = page.locator(InventoryPage.selectors.logoutLink);
    this.burgerMenu = page.locator(InventoryPage.selectors.burgerMenu);

    this.sortDropdown = page.locator(InventoryPage.selectors.sortDropdown);
  }

  async checkIsOnInventoryPage() {
    await expect(this.page).toHaveURL(new RegExp(this.pageUrlFragment));
    await expect(this.inventoryList).toBeVisible();
  }

  async addAllVisibleInventoryItems() {
    await this.checkIsOnInventoryPage();
    for (const item of this.inventoryItems) {
      if (await item.isVisible()) {
        await item.click();
      }
    }
  }
}
