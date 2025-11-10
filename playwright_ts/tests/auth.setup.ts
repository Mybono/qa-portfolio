import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages';
import { UserRole } from 'sdk/interfaces';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAs(UserRole.standard_user);
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: authFile });
});
