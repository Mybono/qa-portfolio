from playwright.sync_api import Page, expect
from typing import Dict, Final
from .base_page import BasePage
from ..models import UserRoleType
from ..constants import urls
from ..config import env
# Map user roles to credentials loaded from environment variables
CREDENTIALS_MAP: Dict[UserRoleType, Dict[str, str]] = {
    'standard_user': {'username': env.standard_user, 'password': env.password},
    'locked_out_user': {'username': env.locked_out_user, 'password': env.password},
    'problem_user': {'username': env.problem_user, 'password': env.password},
    'performance_glitch_user': {'username': env.glitch_user, 'password': env.password},
    'error_user': {'username': env.error_user, 'password': env.password},
    'visual_user': {'username': env.visual_user, 'password': env.password},
}

class LoginSelectors:
    username_input: Final[str] = '[data-test="username"]'
    password_input: Final[str] = '[data-test="password"]'
    login_button: Final[str] = '[data-test="login-button"]'
    error_message: Final[str] = '[data-test="error"]'
    error_button: Final[str] = '[data-test="error-button"]'

class LoginPage(BasePage):

    def __init__(self, page: Page):
        super().__init__(page)
        self.page_url = urls.base_url
        self.username_input = page.locator(LoginSelectors.username_input)
        self.password_input = page.locator(LoginSelectors.password_input)
        self.login_button = page.locator(LoginSelectors.login_button)
        self.error_message_container = page.locator(LoginSelectors.error_message)

    def navigate_to_login(self):
        """Navigate to the login page using the base URL."""
        if not self.page_url:
            raise ValueError("BASE_URL is not set in the .env file")
        self.navigate_to(self.page_url)

    def login(self, username: str, password: str):
        self.navigate_to_login()
    
        """Fill in credentials and click the login button."""
        self.username_input.wait_for(state="visible")
        self.username_input.fill(username)

        self.password_input.wait_for(state="visible")
        self.password_input.fill(password)

        self.login_button.wait_for(state="visible")
        self.login_button.click()

        self.login_button.wait_for(state="invisble")
        expect(self.page).to_have_url(urls.inventory)

    def login_as(self, user_role: UserRoleType):
        """Login using a predefined role from the CREDENTIALS_MAP."""
        try:
            creds = CREDENTIALS_MAP[user_role]
        except KeyError:
            raise ValueError(f"Unknown user role: {user_role}")
        except TypeError:
            raise ValueError(
                f"Credentials for {user_role} are not loaded from .env. Check your .env file."
            )
        self.login(creds['username'], creds['password'])

    def get_error_message(self) -> str:
        """Return the error message text after ensuring it is visible."""
        self.error_message_container.wait_for(state="visible")
        return self.error_message_container.text_content()
