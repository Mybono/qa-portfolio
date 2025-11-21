import { env, logger, AssetsTracker, DbConnection, UserService } from 'sdk_automation';
import { Db } from 'mongodb';

type ServiceConstructor<T> = new (db: Db) => T;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  var _db: Db | undefined;
  var _services:
    | {
        [key: string]: any;
      }
    | undefined;
}

const dbInit = async (): Promise<Db> => {
  if (!globalThis._db) {
    globalThis._db = await DbConnection.getInstance().openConnection(env.MONGO_CONNECTION_STRING);
    logger.info('[ServicesInit] DB connection established');
  }

  return globalThis._db;
};

const createLazyService = <T extends object>(ServiceClass: ServiceConstructor<T>): T =>
  new Proxy({} as T, {
    get(_target: T, prop: string | symbol) {
      return async (...args: unknown[]) => {
        if (!globalThis._services) {
          globalThis._services = {};
        }
        if (!globalThis._services[ServiceClass.name]) {
          const db = await dbInit();
          globalThis._services[ServiceClass.name] = new ServiceClass(db);
          logger.info(`[ServicesInit] ${ServiceClass.name} initialized`);
        }

        const instance = globalThis._services[ServiceClass.name] as T;
        const method = instance[prop as keyof T];

        if (typeof method === 'function') {
          return method(...args);
        }

        throw new Error(`Property ${String(prop)} is not a function on ${ServiceClass.name}`);
      };
    },
  });

export const userService = createLazyService(UserService);
export const assetsTracker = createLazyService(AssetsTracker);
