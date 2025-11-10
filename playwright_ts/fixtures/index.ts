import { test as base, expect } from "@playwright/test";
import { LoginPage, InventoryPage, CartPage, CheckOutPage } from "../pages";
import { User, UserRole } from "sdk/interfaces";
import { url } from "sdk/constants";
import { userService, assetsTracker } from "../services";

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkOutPage: CheckOutPage;
  loggedInPage: LoginPage;
};

type DataFixtures = {
  testUser: User;
};

export const test = base.extend<PageFixtures & DataFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(loginPage.pageUrl);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await page.goto(url.inventory);
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

  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(loginPage.pageUrl);
    await loginPage.loginAs(UserRole.standard_user);
    await use(loginPage);
  },

  testUser: async ({}, use) => {
    const user = await userService.createUser(UserRole.standard_user);
    assetsTracker.track({ users: user._id });
    await use(user);
  },
});

export { expect };
