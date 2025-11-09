from typing import Final
from playwright.sync_api import Page, expect
from .base_page import BasePage
from ..constants import urls
from ..utils import DataGenerator 


class CheckOutPage(BasePage):
    """Page object for the Checkout Step One page."""
    page_url_fragment: Final[str] = urls.checkout_step_one

    def __init__(self, page: Page):
        super().__init__(page)
        self.page = page
        self.first_name_input = page.locator('[data-test="firstName"]')
        self.last_name_input = page.locator('[data-test="lastName"]')
        self.postal_code_input = page.locator('[data-test="postalCode"]')
        self.continue_btn = page.locator('[data-test="continue"]')
        self.checkout_form = page.locator('.checkout_info') 
        self.cancel_btn = page.locator('[data-test="cancel"]')
        self.page_title = page.locator('[data-test="title"]')
        self.data_gen = DataGenerator()

    def check_is_on_checkout_page(self):
        """Verify that we are on the Checkout Step One page."""
        expect(self.page).to_have_url(lambda url: self.page_url_fragment in url)
        expect(self.first_name_input).to_be_visible()

    async def fill_checkout_form(self, user_data: dict = None):
        """Fill the checkout form with provided user data."""
        if not user_data:
            user_data = self.data_gen.get_random_user(user_role="standard_user")
        await self.first_name_input.fill(user_data['firstName'])
        await self.last_name_input.fill(user_data['lastName'])
        await self.postal_code_input.fill(user_data['postalCode'])
        await self.continue_btn.click()
