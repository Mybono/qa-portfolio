import { Page, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    async navigateTo(url: string) {
        await this.page.goto(url);
        await this.checkUrl(url);
    }
    async checkUrl(expectedUrl: string) {
        await expect(this.page).toHaveURL(expectedUrl);
    }
}
