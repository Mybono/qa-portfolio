import { Page, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.checkUrl(url);
  }
  async checkUrl(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }
}
