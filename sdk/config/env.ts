import { UserRoleType, Credentials } from '../interfaces';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[requireEnv]: Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  STANDART_USER: requireEnv('STANDART_USER'),
  LOCKED_OUT_USER: requireEnv('LOCKED_OUT_USER'),
  PROBLEM_USER: requireEnv('PROBLEM_USER'),
  GLITCH_USER: requireEnv('GLITCH_USER'),
  ERROR_USER: requireEnv('ERROR_USER'),
  VISUAL_USER: requireEnv('VISUAL_USER'),
  PASSWORD: requireEnv('PASSWORD'),
  MONGO_CONNECTION_STRING: requireEnv('MONGO_CONNECTION_STRING'),
  TIMEOUT: 5000,
  TEN_SECONDS: 10000,
} as const;


export const CREDENTIALS_MAP: Record<UserRoleType, Credentials> = {
    standard_user: { username: env.STANDART_USER, password: env.PASSWORD },
    locked_out_user: { username: env.LOCKED_OUT_USER, password: env.PASSWORD },
    problem_user: { username: env.PROBLEM_USER, password: env.PASSWORD },
    performance_glitch_user: { username: env.GLITCH_USER, password: env.PASSWORD },
    error_user: { username: env.ERROR_USER, password: env.PASSWORD },
    visual_user: { username: env.VISUAL_USER, password: env.PASSWORD },
};
