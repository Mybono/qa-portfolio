export const selectors = {
    login: {
        usernameInput: '[data-test="username"]',
        passwordInput: '[data-test="password"]',
        loginButton: '[data-test="login-button"]',
        errorMessage: '[data-test="error"]',
        errorButton: '[data-test="error-button"]'
    },
    inventory: {
        backpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
        bikeLight: '[data-test="add-to-cart-sauce-labs-bike-light"]',
        boltTShirt: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
        fleeceJacket: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
        labSonesie: '[data-test="add-to-cart-sauce-labs-onesie"]',
        shirtRed: '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]',
        menuButton: '#react-burger-menu-btn',
        logoutLink: '[data-test="logout-sidebar-link"]',
        pageTitle: '[data-test="title"]',
        cartBadge: '[data-test="shopping-cart-badge"]',
        itemPrice: '[data-test="inventory-item-price"]',
        burgerMenu: '[data-test="open-menu"]',
        itemName: '[data-test="inventory-item-name"]'
    },
    cart: {
        shoppingCartLink: '[data-test="shopping-cart-link"]',
        continueShopping: '[data-test="continue-shopping"]',
        checkoutBtn: '[data-test="checkout"]',
        inventory_item_price: '[data-test="inventory-item-price"]',
        inventory_item_name: '.inventory_item_name'
    },
    checkout: {
        continueBtn: '[data-test="continue"]',
        cancelBtn: '[data-test="cancel"]',
        firstName: '[data-test="firstName"]',
        lastName: '[data-test="lastName"]',
        postalCode: '[data-test="postalCode"]',
        finish: '[data-test="finish"]',
        backToProductsBtn: '[data-test="back-to-products"]',
        completeHeader: '[data-test="complete-header"]',
        error: ['data-test="error"']
    },
    filter: {
        sortDropdown: 'select[data-test="product-sort-container"]',
        highToLow: 'hilo',   
        lowToHigh: 'lohi',    
        nameAZ: 'az',         
        nameZA: 'za', 
    },
    removeButtons: {
        backpack: "[data-test='remove-sauce-labs-backpack']",
    },
} as const;

export const inventorySelectors = [
    selectors.inventory.backpack,
    selectors.inventory.bikeLight,
    selectors.inventory.boltTShirt,
    selectors.inventory.fleeceJacket,
    selectors.inventory.labSonesie,
    selectors.inventory.shirtRed,
];
