import pytest
from playwright.async_api import expect
from ..pages import login_page, inventory_page
from ..constants import selectors, urls
from ..models import UserRole

pytestmark = pytest.mark.asyncio


@pytest.mark.describe("Login Page")
class TestLoginPage:
    """Tests for login page UI and authentication behavior using global page objects."""

    async def test_should_render_all_login_fields(self):
        """Verify that username, password, and login button are visible."""
        await login_page.username_input.wait_for(state="visible")
        await login_page.password_input.wait_for(state="visible")
        await login_page.login_button.wait_for(state="visible")

    async def test_should_login_successfully_with_valid_credentials(self):
        """Verify successful login with valid credentials."""
        await login_page.login_as(UserRole.STANDARD_USER)

        page = inventory_page.page
        await page.wait_for_load_state("domcontentloaded")

        await page.wait_for_selector(selectors.inventory.page_title)
        title = await page.locator(selectors.inventory.page_title).text_content()
        assert title == "Products"

    async def test_should_show_error_for_invalid_username(self):
        """Verify error message when username is invalid."""
        await login_page.login("wrong_user", login_page.password_input.input_value())
        await login_page.error_message_container.wait_for(state="visible")
        error_text = await login_page.get_error_message()
        assert "Username and password do not match" in error_text

    async def test_should_show_error_for_invalid_password(self):
        """Verify error message when password is invalid."""
        await login_page.login(login_page.username_input.input_value(), "wrong_password")
        await login_page.error_message_container.wait_for(state="visible")
        error_text = await login_page.get_error_message()
        assert "Username and password do not match" in error_text

    async def test_should_show_error_when_fields_are_empty(self):
        """Verify error message when both fields are empty."""
        await login_page.login("", "")
        await login_page.error_message_container.wait_for(state="visible")
        error_text = await login_page.get_error_message()
        assert "Username is required" in error_text

    async def test_should_clear_error_after_closing(self):
        """Verify error message disappears after clicking close."""
        await login_page.login("", "")
        await login_page.error_message_container.wait_for(state="visible")
        await login_page.error_message_container.locator(selectors.login.error_button).click()
        await login_page.error_message_container.wait_for(state="hidden")

    async def test_should_prevent_access_to_inventory_without_login(self):
        """Verify that unauthenticated user is redirected to login."""
        page = inventory_page.page
        await page.goto(urls.inventory)
        await expect(page).to_have_url(urls.base_url)

    async def test_should_logout_successfully(self):
        """Verify that user can log out successfully."""
        page = inventory_page.page

        await login_page.login_as(UserRole.STANDARD_USER)
        await page.wait_for_load_state("domcontentloaded")

        burger_menu = page.locator(selectors.inventory.burger_menu)
        await burger_menu.wait_for(state="visible")
        await burger_menu.click(force=True)

        logout_link = page.locator(selectors.inventory.logout_link)
        await logout_link.wait_for(state="visible")
        await logout_link.click(force=True)
        await expect(page).to_have_url(urls.base_url)
