import { test, expect } from '@playwright/test';
import { selectors, url } from 'sdk/constants';
import { BasePage, LoginPage } from '../pages';
import { UserRole } from 'sdk/interfaces';
import { env } from 'sdk/config';

test.describe('Login Page', () => {
  let loginPage: LoginPage;
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    basePage = new BasePage(page)
    await basePage.navigateTo(loginPage.pageUrl);
  });

  test('renders username, password fields and login button', async ({ page }) => {
    await expect(page.locator(selectors.login.usernameInput)).toBeVisible();
    await expect(page.locator(selectors.login.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.login.loginButton)).toBeVisible();
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    await loginPage.loginAs(UserRole.standard_user);
    await expect(page).toHaveURL(url.inventory);
  });

  test('shows error when username is invalid', async () => {
    await loginPage.login('wrong_user', env.PASSWORD);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('shows error when password is invalid', async () => {
    await loginPage.login(env.STANDART_USER, 'wrong_pass');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('shows error when username is missing', async () => {
    await loginPage.passwordInput.fill(env.PASSWORD);
    await loginPage.loginButton.click();
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('shows error when password is missing', async () => {
    await loginPage.usernameInput.fill(env.STANDART_USER);
    await loginPage.loginButton.click();
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });

  test('shows error when both fields are empty', async () => {
    await loginPage.loginButton.click();
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('should clear error after closing it', async () => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessageContainer).toBeVisible();
    await loginPage.errorButton.click(); 
    await expect(loginPage.errorMessageContainer).toBeHidden();
  });

  test('prevents access to inventory without login', async ({ page }) => {
    await page.goto(url.inventory);
    await expect(page).toHaveURL(url.baseUrl);
  });

  test('should logout successfully', async () => {
    await loginPage.loginAs(UserRole.standard_user);
    await loginPage.logout();
    await expect(loginPage.page).toHaveURL(url.baseUrl);
  });
});
