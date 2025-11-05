export const selectors = {
    login: {
        usernameInput: '#user-name',
        passwordInput: '#password',
        loginButton: '[data-test="login-button"]',
        errorMessage: "[data-test='error']"
    },
    inventory: {
        backpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
        bikeLight: '[data-test="add-to-cart-sauce-labs-bike-light"]',
        boltTShirt: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
        fleeceJacket: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
        onesie: '[data-test="add-to-cart-sauce-labs-onesie"]',
        shirtRed: '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]',
        menuButton: '#react-burger-menu-btn',
        logoutLink: '#logout_sidebar_link',
    },
    cart: {
        shoppingCartLink: '[data-test="shopping-cart-link"]',
        continueShopping: '[data-test="continue-shopping"]',
        checkoutBtn: '#checkout',
        inventoryItemPrice: '[data-test="inventory-item-price"]'
    },
    filter: {
        sortDropdown: 'select[data-test="product-sort-container"]',
        highToLow: 'option[value="hilo"]',
        lowToHigh: 'option[value="lohi"]',
        nameAZ: 'option[value="az"]',
        nameZA: 'option[value="za"]',
    },
    removeButtons: {
        backpack: "[data-test='remove-sauce-labs-backpack']",
    }
} as const;
