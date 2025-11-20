import { _, url, User, UserRole } from 'sdk_automation';
import { BasePage, CartPage } from '../pages';
import { Page } from '@playwright/test';

export class CheckOutPage extends BasePage {
  static readonly selectors = {
    firstNameInput: '[data-test="firstName"]',
    backToProductsBtn: '[data-test="back-to-products"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    pageTitle: '[data-test="title"]',
    checkoutForm: '.checkout_info',
    finishButton: '[data-test="finish"]',
  };

  readonly page: Page;
  readonly pageUrlStepOne = url.checkoutStepOne;
  readonly pageUrlStepTwo = url.checkoutStepTwo;
  readonly pageUrlComplete = url.checkoutComplete;
  readonly backToProductsBtn;
  readonly firstNameInput;
  readonly lastNameInput;
  readonly postalCodeInput;
  readonly continueButton;
  readonly cancelButton;
  readonly pageTitle;
  readonly checkoutForm;
  readonly finishButton;
  readonly cartPage: CartPage;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.cartPage = new CartPage(page);
    this.backToProductsBtn = page.locator(CheckOutPage.selectors.backToProductsBtn);
    this.firstNameInput = page.locator(CheckOutPage.selectors.firstNameInput);
    this.lastNameInput = page.locator(CheckOutPage.selectors.lastNameInput);
    this.postalCodeInput = page.locator(CheckOutPage.selectors.postalCodeInput);
    this.continueButton = page.locator(CheckOutPage.selectors.continueButton);
    this.cancelButton = page.locator(CheckOutPage.selectors.cancelButton);
    this.checkoutForm = page.locator(CheckOutPage.selectors.checkoutForm);
    this.pageTitle = page.locator(CheckOutPage.selectors.pageTitle);
    this.finishButton = page.locator(CheckOutPage.selectors.finishButton);
  }

  async navigateToCheckoutForm(): Promise<void> {
    try {
      await this.checkUrl(this.cartPage.pageUrl);
      await this.cartPage.checkoutBtn.waitFor({ state: 'visible' });
      await this.cartPage.checkoutBtn.click();
      await this.checkUrl(this.pageUrlStepOne);
    } catch (error) {
      throw new Error(`[navigateToCheckoutForm]: Failed to navigate to checkout form: ${error}`);
    }
  }

  async fillCheckoutForm(userData?: User): Promise<void> {
    try {
      const data = userData ??
        _.getRandomUser?.(UserRole.standard_user) ?? {
          firstName: 'John',
          lastName: 'Doe',
          postalCode: '12345',
        };

      await this.firstNameInput.fill(data.firstName);
      await this.lastNameInput.fill(data.lastName);
      await this.postalCodeInput.fill(data.postalCode);
      await this.continueButton.click();
      await this.checkUrl(this.pageUrlStepTwo);
    } catch (error) {
      throw new Error(`[fillCheckoutForm]: ${error}`);
    }
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForURL(url.checkoutComplete);
  }
}
