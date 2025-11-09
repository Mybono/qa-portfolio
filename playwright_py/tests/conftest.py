import pytest
from typing import AsyncGenerator, Callable
from pymongo.database import Database
from playwright.async_api import Page
from ..pages.login_page import LoginPage
from ..pages.inventory_page import InventoryPage
from ..constants import urls
from ..services import DbConnection, UserService
from ..models import UserRole, UserRoleType
from ..utils import AssetsTracker
from ..config import env

@pytest.fixture
async def tracked_assets(db) -> AsyncGenerator[AssetsTracker, None]:
    """
    Provides an AssetsTracker instance per test.
    Cleans up only the assets tracked during this test.
    """
    tracker = AssetsTracker(db)
    yield tracker
    if tracker._tracked_assets:
        await tracker.cleanup({c: True for c in tracker._tracked_assets})


# --- Database Fixtures ---
@pytest.fixture(scope="session")
async def db_instance() -> Database:
    """Initialize MongoDB connection once per session."""
    print("\n--- Initializing MongoDB Connection ---")
    db_conn = DbConnection.get_instance()
    db = await db_conn.open_connection(env.MONGO_CONNECTION_STRING)
    yield db
    print("\n--- Closing MongoDB Connection ---")

@pytest.fixture(scope="session")
def service_factory(db_instance: Database) -> Callable:
    """Factory to create service instances with DB connection."""
    def _factory(ServiceClass):
        return ServiceClass(db_instance)
    return _factory

@pytest.fixture(scope="session")
def assetsTracker(service_factory: Callable) -> AssetsTracker:
    return service_factory(AssetsTracker)

@pytest.fixture(scope="session")
def userService(service_factory: Callable) -> UserService:
    return service_factory(UserService)

# --- Page Fixtures ---
@pytest.fixture
async def login_page(page: Page):
    """Return a fresh LoginPage instance for each test."""
    return LoginPage(page)

@pytest.fixture
async def inventory_page(page: Page):
    """Return a fresh InventoryPage instance for each test."""
    return InventoryPage(page)

async def login_in(login_page: LoginPage, inventory_page: InventoryPage):
    """
    Provides a login helper function.
    By default logs in as UserRole.STANDARD_USER, 
    but can override with a different role.
    """

    async def _login(user_role: UserRoleType = UserRole.STANDARD_USER):
        await login_page.login_as(user_role)
        inventory_page.check_is_on_inventory_page()
        return inventory_page

    return _login