from typing import Final, List

class InventorySelectors:
    title_products: Final[str] = '//span[@data-test="title" and text()="Products"]',
    backpack: Final[str] = '[data-test="add-to-cart-sauce-labs-backpack"]'
    bike_light: Final[str] = '[data-test="add-to-cart-sauce-labs-bike-light"]'
    bolt_t_shirt: Final[str] = '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]'
    fleece_jacket: Final[str] = '[data-test="add-to-cart-sauce-labs-fleece-jacket"]'
    lab_sonesie: Final[str] = '[data-test="add-to-cart-sauce-labs-onesie"]'
    shirt_red: Final[str] = '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]'
    menu_button: Final[str] = '#react-burger-menu-btn'
    logout_link: Final[str] = '[data-test="logout-sidebar-link"]'
    page_title: Final[str] = '[data-test="title"]'
    cart_badge: Final[str] = '[data-test="shopping-cart-badge"]'
    item_price: Final[str] = '[data-test="inventory-item-price"]'
    burger_menu: Final[str] = '[data-test="open-menu"]'
    item_name: Final[str] = '[data-test="inventory-item-name"]'

class CartSelectors:
    shopping_cart_link: Final[str] = '[data-test="shopping-cart-link"]'
    continue_shopping: Final[str] = '[data-test="continue-shopping"]'
    checkout_btn: Final[str] = '[data-test="checkout"]'
    inventory_item_price: Final[str] = '[data-test="inventory-item-price"]'
    inventory_item_name: Final[str] = '.inventory_item_name'

class CheckoutSelectors:
    continue_btn: Final[str] = '[data-test="continue"]'
    cancel_btn: Final[str] = '[data-test="cancel"]'
    first_name: Final[str] = '[data-test="firstName"]'
    last_name: Final[str] = '[data-test="lastName"]'
    postal_code: Final[str] = '[data-test="postalCode"]'
    finish: Final[str] = '[data-test="finish"]'
    back_to_products_btn: Final[str] = '[data-test="back-to-products"]'
    complete_header: Final[str] = '[data-test="complete-header"]'
    error: Final[str] = '[data-test="error"]'

class FilterSelectors:
    sort_dropdown: Final[str] = 'select[data-test="product-sort-container"]'
    high_to_low: Final[str] = 'hilo'
    low_to_high: Final[str] = 'lohi'
    name_az: Final[str] = 'az'
    name_za: Final[str] = 'za'

class RemoveButtonsSelectors:
    backpack: Final[str] = "[data-test='remove-sauce-labs-backpack']"

class Selectors:
    """Provides dot-notation access to all UI selectors."""
    inventory: Final[InventorySelectors] = InventorySelectors()
    cart: Final[CartSelectors] = CartSelectors()
    checkout: Final[CheckoutSelectors] = CheckoutSelectors()
    filter: Final[FilterSelectors] = FilterSelectors()
    remove_buttons: Final[RemoveButtonsSelectors] = RemoveButtonsSelectors()

# Export the single instance
selectors: Final[Selectors] = Selectors()

# Export the list of inventory selectors using the new structure
inventory_selectors: Final[List[str]] = [
    selectors.inventory.backpack,
    selectors.inventory.bike_light,
    selectors.inventory.bolt_t_shirt,
    selectors.inventory.fleece_jacket,
    selectors.inventory.lab_sonesie,
    selectors.inventory.shirt_red,
]