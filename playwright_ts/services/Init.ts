import {
  env,
  logger,
  AssetsTracker,
  DbConnection,
  UserService,
} from "sdk_automation";
import { Db } from "mongodb";

type ServiceConstructor<T> = new (db: Db) => T;

declare global {
  const _db: Db | undefined;
  const _services: Partial<{
    UserService: UserService;
    AssetsTracker: AssetsTracker;
  }> | undefined;
}

const dbInit = async (): Promise<Db> => {
  if (!globalThis._db) {
    globalThis._db = await DbConnection.getInstance().openConnection(env.MONGO_CONNECTION_STRING);
    logger.info("[ServicesInit] DB connection established");
  }
  return globalThis._db;
};

const createLazyService = <T extends object>(
  ServiceClass: ServiceConstructor<T>,
): T =>
  new Proxy({} as T, {
    get(target: T, prop: string | symbol, _receiver: unknown) { // <-- добавили _
      return async (...args: unknown[]) => {
        if (!globalThis._services) { globalThis._services = {}; }
        if (!globalThis._services[ServiceClass.name]) {
          const db = await dbInit();
          globalThis._services[ServiceClass.name] = new ServiceClass(db);
          logger.info(`[ServicesInit] ${ServiceClass.name} initialized`);
        }
        const instance = (globalThis._services as any)[ServiceClass.name] as T;
        return instance[prop as keyof T](...args);

      };
    },
  });

export const userService = createLazyService(UserService);
export const assetsTracker = createLazyService(AssetsTracker);
