import { test, expect } from '@playwright/test';
import { selectors, url } from '../constants';
import { UserRole } from '../interfaces';
import { login } from '../utils/login';
import { env } from '../config/env';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url.baseUrl);
  });

  test('renders username, password fields and login button', async ({ page }) => {
    await expect(page.locator(selectors.login.usernameInput)).toBeVisible();
    await expect(page.locator(selectors.login.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.login.loginButton)).toBeVisible();
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    await login(page, UserRole.standard_user);
    await expect(page).toHaveURL(url.inventory);
  });

  test('shows error when username is invalid', async ({ page }) => {
    await page.fill(selectors.login.usernameInput, 'wrong_user');
    await page.fill(selectors.login.passwordInput, env.PASSWORD);
    await page.click((selectors.login.loginButton));
    await expect(page.locator(selectors.login.errorMessage)).toContainText('Username and password do not match');
  });

  test('shows error when password is invalid', async ({ page }) => {
    await page.fill(selectors.login.usernameInput, env.STANDART_USER);
    await page.fill(selectors.login.passwordInput, 'wrong_pass');
    await page.click((selectors.login.loginButton));
    await expect(page.locator(selectors.login.errorMessage)).toContainText('Username and password do not match');
  });

  test('shows error when username is missing', async ({ page }) => {
    await page.fill(selectors.login.passwordInput, env.PASSWORD);
    await page.click((selectors.login.loginButton));
    await expect(page.locator(selectors.login.errorMessage)).toContainText('Username is required');
  });

  test('shows error when password is missing', async ({ page }) => {
    await page.fill(selectors.login.usernameInput, env.STANDART_USER);
    await page.click((selectors.login.loginButton));
    await expect(page.locator(selectors.login.errorMessage)).toContainText('Password is required');
  });

  test('shows error when both fields are empty', async ({ page }) => {
    await page.click((selectors.login.loginButton));
    await expect(page.locator(selectors.login.errorMessage)).toContainText('Username is required');
  });

  test('should clear error after closing it', async ({ page }) => {
    await page.click((selectors.login.loginButton));
    const error = page.locator(selectors.login.errorMessage);
    await expect(error).toBeVisible();
    await page.click(selectors.login.errorButton);
    await expect(error).toBeHidden();
  });

  test('prevents access to inventory without login', async ({ page }) => {
    await page.goto(url.inventory);
    await expect(page).toHaveURL(url.baseUrl);
  });

  test('should logout successfully', async ({ page }) => {
    await login(page, UserRole.standard_user);
    await page.click(selectors.inventory.burgerMenu);
    await page.click(selectors.inventory.logoutLink);
    await expect(page).toHaveURL(url.baseUrl);
  });
});
