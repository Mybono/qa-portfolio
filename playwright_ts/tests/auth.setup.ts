import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages";
import { UserRole } from "sdk/interfaces";
import path from "path";
import fs from "fs";

const authFile = path.resolve(__dirname, "../config/user.json");
const dir = path.dirname(authFile);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

setup("authenticate", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(UserRole.standard_user);
    await expect(page).toHaveURL(/inventory/);
    await page.context().storageState({ path: authFile });
  } catch (error) {
    throw new Error(`[authenticate]: Authentication failed: ${error}`);
  }
});
