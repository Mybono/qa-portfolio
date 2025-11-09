from typing import Final, List
from playwright.sync_api import Page, expect
from pages.base_page import BasePage
from utils import urls

class InventoryPage(BasePage):

    def __init__(self, page: Page):
        super().__init__(page)
        self.page_url_fragment = urls.inventory
        self.page = page

        self.backpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
        self.bike_light = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
        self.bolt_t_shirt = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
        self.fleece_jacket = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
        self.lab_sonesie = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]')
        self.shirt_red = page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')

        self.inventory_items: Final[List] = [
            self.backpack,
            self.bike_light,
            self.bolt_t_shirt,
            self.fleece_jacket,
            self.lab_sonesie,
            self.shirt_red,
        ]

        self.inventory_list = page.locator('[data-test="inventory-list"]')
        self.page_title = page.locator('[data-test="title"]')

        self.shopping_cart_link = page.locator('[data-test="shopping-cart-link"]')
        self.cart_badge = page.locator('[data-test="shopping-cart-badge"]')
        self.checkout_btn = page.locator('[data-test="checkout"]')
        self.continue_btn = page.locator('[data-test="continue"]')
        self.finish_btn = page.locator('[data-test="finish"]')
        self.back_to_products_btn = page.locator('[data-test="back-to-products"]')
        self.complete_header = page.locator('[data-test="checkout_complete_container"] h2')
        self.inventory_item_name = page.locator('[data-test="inventory-item-name"]')
        self.inventory_item_price = page.locator('[data-test="inventory-item-price"]')

        self.menu_button = page.locator('#react-burger-menu-btn')
        self.logout_link = page.locator('[data-test="logout-sidebar-link"]')
        self.burger_menu = page.locator('[data-test="open-menu"]')

        self.sort_dropdown = page.locator('select[data-test="product_sort_container"]')
        self.sort_low_to_high = 'lohi'
        self.sort_high_to_low = 'hilo'
        self.sort_name_az = 'az'
        self.sort_name_za = 'za'

    def check_is_on_inventory_page(self):
        expect(self.page).to_have_url(lambda url: self.page_url_fragment in url)
        expect(self.inventory_list).to_be_visible()

    async def add_all_visible_inventory_items(self):
        for item in self.inventory_items:
            if await item.is_visible():
                await item.click()
