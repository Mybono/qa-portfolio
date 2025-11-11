import { test as setup, expect } from "@playwright/test";
import { UserRole, url } from "@mybono/sdk_automation";
import { LoginPage } from "../pages";
import path from "path";
import fs from "fs";

const authFile = path.resolve(__dirname, "../auth/user.json");
const dir = path.dirname(authFile);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

setup("authenticate", async ({ page }) => {
  try {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(UserRole.standard_user);
    await expect(page).toHaveURL(url.inventory);
    await page.context().storageState({ path: authFile });
  } catch (error) {
    throw new Error(`[authenticate]: Authentication failed: ${error}`);
  }
});
