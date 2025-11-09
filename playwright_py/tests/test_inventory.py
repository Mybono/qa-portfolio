import pytest
from playwright.async_api import expect
from ..pages.inventory_page import InventoryPage
from ..pages.check_out_page import CheckOutPage
from ..models import collections, UserRole

pytestmark = pytest.mark.asyncio

@pytest.mark.describe("Inventory Page Tests")
class TestInventoryPage:

    async def test_e2e_add_all_and_checkout(
        self,
        login_in, 
        check_out_page: CheckOutPage,
        userService,
        tracked_assets
    ):
        """Full end-to-end flow: add all items, checkout, verify completion."""
        inventory_page: InventoryPage = await login_in()  

        # Add all visible inventory items
        await inventory_page.add_all_visible_inventory_items()

        # Go to cart
        await inventory_page.shopping_cart_link.click()
        page = inventory_page.page
        await expect(page).to_have_url(lambda url: "cart" in url)

        # Verify all added items
        cart_items = page.locator(inventory_page.inventory_item_name)
        await expect(cart_items).to_have_count(len(inventory_page.inventory_items))

        # Proceed to checkout
        await inventory_page.checkout_btn.click()
        await expect(page).to_have_url(lambda url: "checkout-step-one" in url)

        # Create user and track
        standard_user = await userService.create_user()
        await tracked_assets.track({collections.users: standard_user["_id"]})

        # Fill checkout form
        await check_out_page.fill_checkout_form(standard_user)

        # Checkout Step 2
        await expect(page).to_have_url(lambda url: "checkout-step-two" in url)
        await expect(page.locator(inventory_page.inventory_item_price)).to_be_visible()

        # Finish checkout
        await inventory_page.finish_btn.click()

        # Checkout Complete
        await expect(page).to_have_url(lambda url: "checkout-complete" in url)
        await expect(inventory_page.complete_header).to_have_text("Thank you for your order!")

        # Back to inventory
        await inventory_page.back_to_products_btn.click()
        await expect(page).to_have_url(lambda url: "inventory" in url)

    async def test_should_sort_items_by_price_low_to_high(self, login_in: callable):
        inventory_page: InventoryPage = await login_in()
        page = inventory_page.page

        await inventory_page.sort_dropdown.select_option(inventory_page.sort_low_to_high)
        prices_str = await page.locator(inventory_page.inventory_item_price).all_inner_texts()
        prices = [float(p.replace("$", "")) for p in prices_str]
        assert prices == sorted(prices), "Items are not sorted by price (low to high)"

    async def test_should_sort_items_by_price_high_to_low(self, login_in: callable):
        inventory_page: InventoryPage = await login_in()
        page = inventory_page.page

        await inventory_page.sort_dropdown.select_option(inventory_page.sort_high_to_low)
        prices_str = await page.locator(inventory_page.inventory_item_price).all_inner_texts()
        prices = [float(p.replace("$", "")) for p in prices_str]
        assert prices == sorted(prices, reverse=True), "Items are not sorted by price (high to low)"

    async def test_should_sort_items_by_name_a_to_z(self, login_in: callable):
        inventory_page: InventoryPage = await login_in()
        page = inventory_page.page

        await inventory_page.sort_dropdown.select_option(inventory_page.sort_name_az)
        names_str = await page.locator(inventory_page.inventory_item_name).all_inner_texts()
        names = [n.strip().lower() for n in names_str]
        assert names == sorted(names), "Items are not sorted by name (A to Z)"

    async def test_should_sort_items_by_name_z_to_a(self, login_in: callable):
        inventory_page: InventoryPage = await login_in()
        page = inventory_page.page

        await inventory_page.sort_dropdown.select_option(inventory_page.sort_name_za)
        names_str = await page.locator(inventory_page.inventory_item_name).all_inner_texts()
        names = [n.strip().lower() for n in names_str]
        assert names == sorted(names, reverse=True), "Items are not sorted by name (Z to A)"
