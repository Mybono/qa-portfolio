import { url, CREDENTIALS_MAP, UserRoleType } from "sdk_automation";
import { BasePage, InventoryPage } from "../pages";
import { expect, Page } from "@playwright/test";


export class LoginPage extends BasePage {
  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly errorMessageContainer;
  readonly errorButton;
  readonly pageUrl: string;

  static readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    errorButton: '[data-test="error-button"]',
  };

  constructor(page: Page) {
    super(page);
    this.pageUrl = url.baseUrl;
    this.usernameInput = page.locator(LoginPage.selectors.usernameInput);
    this.passwordInput = page.locator(LoginPage.selectors.passwordInput);
    this.loginButton = page.locator(LoginPage.selectors.loginButton);
    this.errorMessageContainer = page.locator(LoginPage.selectors.errorMessage);
    this.errorButton = page.locator(LoginPage.selectors.errorButton);
  }

  async login(username: string, password: string) {
    try {
      await this.navigateTo(this.pageUrl);

      await this.usernameInput.waitFor({ state: "visible" });
      await this.usernameInput.fill(username);

      await this.passwordInput.waitFor({ state: "visible" });
      await this.passwordInput.fill(password);

      await this.loginButton.waitFor({ state: "visible" });
      await this.loginButton.click();
    } catch (error) {
      throw new Error(`[login]: ${error}`);
    }
  }

  async loginAs(userRole: UserRoleType) {
    const creds = CREDENTIALS_MAP[userRole];
    if (!creds) {
      throw new Error(`Unknown user role: ${userRole}`);
    }
    await this.login(creds.username, creds.password);
  }

  async getErrorMessage(): Promise<string | null> {
    await this.errorMessageContainer.waitFor({ state: "visible" });
    return this.errorMessageContainer.textContent();
  }

  async logout() {
    try {
      const burgerMenu = this.page.locator(InventoryPage.selectors.burgerMenu);
      await burgerMenu.waitFor({ state: "visible" });
      await burgerMenu.click({ force: true });

      const logoutLink = this.page.locator(InventoryPage.selectors.logoutLink);
      await logoutLink.waitFor({ state: "visible" });
      await logoutLink.click();

      await expect(this.page).toHaveURL(url.baseUrl);
    } catch (error) {
      throw new Error(`[logout]: ${error}`);
    }
  }
}
