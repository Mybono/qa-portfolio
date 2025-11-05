function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[requireEnv]: Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  // User credentials
  STANDART_USER: requireEnv('STANDART_USER'),
  LOCKED_OUT_USER: requireEnv('LOCKED_OUT_USER'),
  PROBLEM_USER: requireEnv('PROBLEM_USER'),
  GLITCH_USER: requireEnv('GLITCH_USER'),
  ERROR_USER: requireEnv('ERROR_USER'),
  VISUAL_USER: requireEnv('VISUAL_USER'),
  PASSWORD: requireEnv('PASSWORD'),

  // Playwright settings
  HEADLESS: process.env.HEADLESS !== 'false',
  TIMEOUT: Number(process.env.TIMEOUT) || 30000,
} as const;
