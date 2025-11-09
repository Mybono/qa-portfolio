import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { UserRole } from "sdk/interfaces";

type Fixtures = {
  loginPage: LoginPage;
  loggedInPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(loginPage.pageUrl); 
    await use(loginPage);
  },
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto(loginPage.pageUrl); 
    await loginPage.loginAs(UserRole.standard_user);
    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
