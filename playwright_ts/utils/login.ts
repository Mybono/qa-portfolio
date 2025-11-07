import { selectors, url } from 'sdk/constants';
import { UserRoleType } from 'sdk/interfaces';
import { Page } from '@playwright/test';
import { env } from '../config';
import { logger } from 'sdk/utils';

export async function login(page: Page, userRole: UserRoleType) {
  const creds = {
    standard_user: { username: env.STANDART_USER, password: env.PASSWORD },
    locked_out_user: { username: env.LOCKED_OUT_USER, password: env.PASSWORD },
    problem_user: { username: env.PROBLEM_USER, password: env.PASSWORD },
    performance_glitch_user: { username: env.GLITCH_USER, password: env.PASSWORD },
    error_user: { username: env.ERROR_USER, password: env.PASSWORD },
    visual_user: { username: env.VISUAL_USER, password: env.PASSWORD },
  }[userRole];
  try {
    await page.goto(url.baseUrl);
    await page.fill(selectors.login.usernameInput, creds.username);
    await page.fill(selectors.login.passwordInput, creds.password);
    await page.click(selectors.login.loginButton);
    await page.waitForURL(url.inventory);
    logger.info(`[login]: logined as ${creds.username}`)
  } catch (error) {
    throw new Error(`[login]: ${error}`)
  }
}
