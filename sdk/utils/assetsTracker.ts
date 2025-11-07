import { ObjectId, Collection, Db } from "mongodb";
import { logger } from "../utils"; 

/**
 * SDK for tracking and cleaning up MongoDB assets.
 */
export class AssetsTracker {
    private trackedAssets: Map<string, ObjectId[]> = new Map();
    private dbInstance: Db; 

    constructor(db: Db) {
        this.dbInstance = db;
    }

    public track(params: Record<string, ObjectId>): void {
        const collectionName = Object.keys(params)[0];
        const assetId = params[collectionName];

        if (!collectionName || !assetId) {
            logger.error("[DbAssetsSDK.track]: Invalid input");
            return;
        }

        if (!this.trackedAssets.has(collectionName)) {
            this.trackedAssets.set(collectionName, []);
        }

        this.trackedAssets.get(collectionName)!.push(assetId);
        logger.debug(`[DbAssetsSDK.track]: Tracked ${collectionName} ID ${assetId.toHexString()}`);
    }

    public async cleanup(collectionsToCleanup: Record<string, boolean>): Promise<void> {
        const collections = Object.keys(collectionsToCleanup).filter(c => collectionsToCleanup[c]);
        if (!collections.length) {
            logger.warn("[DbAssetsSDK.cleanup]: No collections specified for cleanup.");
            return;
        }

        for (const collectionName of collections) {
            const ids = this.trackedAssets.get(collectionName);
            if (!ids || ids.length === 0) {
                logger.warn(`[DbAssetsSDK.cleanup]: No tracked assets in ${collectionName}`);
                continue;
            }

            try {
                const collection: Collection = this.dbInstance.collection(collectionName);
                const result = await collection.deleteMany({ _id: { $in: ids } });
                logger.info(`[DbAssetsSDK.cleanup]: Deleted ${result.deletedCount}/${ids.length} from ${collectionName}`);
            } catch (err) {
                logger.error(`[DbAssetsSDK.cleanup]: Error cleaning ${collectionName}: ${err}`);
            }

            this.trackedAssets.set(collectionName, []);
        }

        logger.info("[DbAssetsSDK.cleanup]: Cleanup complete.");
    }
}
