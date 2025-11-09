from .login_page import LoginPage
from .inventory_page import InventoryPage, inventory_selectors
from playwright.async_api import async_playwright, Page
from .CheckOutPage import CheckOutPage
__all__ = [
    "login_page",
    "inventory_page",
    "inventory_selectors",
    "check_out_page"
]

login_page: LoginPage | None = None
inventory_page: InventoryPage | None = None
check_out_page: CheckOutPage | None = None

