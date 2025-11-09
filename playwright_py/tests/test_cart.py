import pytest
from playwright.async_api import expect
from ..pages import login_page, inventory_page
from ..constants import selectors
from ..config import env
from ..models import UserRole

pytestmark = pytest.mark.asyncio

@pytest.mark.describe("Cart Functionality")
class TestCart:

    async def test_should_add_one_product_to_cart(self):
        """Add one product to the cart and verify badge and remove button."""
        page = inventory_page.page

        # Ensure user is logged in
        await login_page.login_as(UserRole.STANDARD_USER)

        # Wait for the backpack button to be visible and click
        backpack_btn = page.locator(selectors.inventory.backpack)
        await backpack_btn.wait_for(state="visible")
        await backpack_btn.click()

        # Verify cart badge shows 1
        cart_badge = page.locator(selectors.inventory.cart_badge)
        await expect(cart_badge).to_have_text("1")

        # Verify remove button is visible
        remove_btn = page.locator(selectors.remove_buttons.backpack)
        await expect(remove_btn).to_be_visible()

    async def test_should_remove_product_from_cart(self):
        """Remove product from the cart and verify badge is hidden."""
        page = inventory_page.page

        # Ensure user is logged in
        await login_page.login_as(UserRole.STANDARD_USER)

        # Add backpack first if it is not already in the cart
        backpack_btn = page.locator(selectors.inventory.backpack)
        remove_btn = page.locator(selectors.remove_buttons.backpack)
        cart_badge = page.locator(selectors.inventory.cart_badge)

        # Only add if remove button is not visible
        if not await remove_btn.is_visible():
            await backpack_btn.wait_for(state="visible")
            await backpack_btn.click()
            await expect(cart_badge).to_have_text("1")

        # Click remove button
        await remove_btn.wait_for(state="visible")
        await remove_btn.click()

        # Verify cart badge is hidden
        await expect(cart_badge).to_be_hidden()
