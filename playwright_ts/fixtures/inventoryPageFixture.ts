import { test as base } from "@playwright/test";
import { CartPage, CheckOutPage, InventoryPage, LoginPage } from "../pages";
import { UserRole } from "sdk/interfaces";
import { url } from "sdk/constants";

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkOutPage: CheckOutPage;
};

export const inventoryTest = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(url.baseUrl);
    await loginPage.loginAs(UserRole.standard_user);
    await use(loginPage);
  },

  inventoryPage: async ({ page, loginPage }, use) => {
    const inventoryPage = new InventoryPage(page);
    await page.waitForURL(url.inventory);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkOutPage: async ({ page }, use) => {
    const checkOutPage = new CheckOutPage(page);
    await use(checkOutPage);
  },
});

export { expect } from "@playwright/test";
