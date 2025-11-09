import { Page } from '@playwright/test';
import { BasePage } from '../pages';
import { url } from 'sdk/constants';


export class CartPage extends BasePage {
    static readonly selectors = {
        shoppingCartLink: '[data-test="shopping-cart-link"]',
        continueShopping: '[data-test="continue-shopping"]',
        checkoutBtn: '[data-test="checkout"]',
        inventory_item_price: '[data-test="inventory-item-price"]',
        inventory_item_name: '.inventory_item_name'
    };

    readonly page: Page;
    readonly pageUrl = url.cart;

    readonly shoppingCartLink;
    readonly continueShopping;
    readonly checkoutBtn;
    readonly inventory_item_price;
    readonly inventory_item_name;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.shoppingCartLink = page.locator(CartPage.selectors.shoppingCartLink);
        this.continueShopping = page.locator(CartPage.selectors.continueShopping);
        this.checkoutBtn = page.locator(CartPage.selectors.checkoutBtn);
        this.inventory_item_price = page.locator(CartPage.selectors.inventory_item_price);
        this.inventory_item_name = page.locator(CartPage.selectors.inventory_item_name);
    }
}
