import { DbConnection, UserService } from 'sdk/services';
import { logger, AssetsTracker } from 'sdk/utils';
import { env } from '../config';
import { Db } from 'mongodb';

type ServiceConstructor<T> = new (db: Db) => T;

declare global {
    var _db: Db | undefined;
    var _services: Record<string, any> | undefined;
}

const dbInit = async (): Promise<Db> => {
    if (!globalThis._db) {
        globalThis._db = await DbConnection.getInstance().openConnection(env.MONGO_CONNECTION_STRING);
        logger.info('[ServicesInit] DB connection established');
    }
    return globalThis._db!;
};

const createLazyService = <T extends object>(ServiceClass: ServiceConstructor<T>): T =>
    new Proxy({} as T, {
        get(target: T, prop: string | symbol, receiver: any) {
            return async (...args: any[]) => {
                if (!globalThis._services) globalThis._services = {};
                if (!globalThis._services[ServiceClass.name]) {
                    const db = await dbInit();
                    globalThis._services[ServiceClass.name] = new ServiceClass(db);
                    logger.info(`[ServicesInit] ${ServiceClass.name} initialized`);
                }
                const instance = globalThis._services[ServiceClass.name] as T;
                // @ts-ignore
                return instance[prop](...args);
            };
        },
    });

export const userService = createLazyService(UserService);
export const assetsTracker = createLazyService(AssetsTracker);
