from typing import Final

class Urls:
    """Provides dot-notation access to all application URLs."""
    base_url: Final[str] = 'https://www.saucedemo.com/'
    inventory: Final[str] = 'https://www.saucedemo.com/inventory.html'
    cart: Final[str] = 'https://www.saucedemo.com/cart.html'
    checkout_step_one: Final[str] = 'https://www.saucedemo.com/checkout-step-one.html'
    checkout_step_two: Final[str] = 'https://www.saucedemo.com/checkout-step-two.html'
    checkout_complete: Final[str] = 'https://www.saucedemo.com/checkout-complete.html'

# Export the single instance
urls: Final[Urls] = Urls()