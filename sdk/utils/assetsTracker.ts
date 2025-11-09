import { Collection, Db, ObjectId } from 'mongodb';
import { CollectionsType } from '../interfaces'; 
import { logger } from '../utils';


type TrackedAssets = Partial<Record<CollectionsType, ObjectId[]>>;

export class AssetsTracker {
  private db: Db;
  private trackedAssets: TrackedAssets = {};

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * Track an asset by collection name (must be in CollectionsType) and its ObjectId
   */
  async track(params: Partial<Record<CollectionsType, ObjectId>>): Promise<void> {
    for (const [collectionName, assetId] of Object.entries(params)) {
      const key = collectionName as CollectionsType;
      if (!this.trackedAssets[key]) {
        this.trackedAssets[key] = [];
      }
      this.trackedAssets[key]!.push(assetId as ObjectId);
      logger.debug(`Tracked asset ID ${assetId} in collection ${collectionName}`);
    }
  }

  /**
   * Cleanup tracked assets for the specified collections
   */
  async cleanup(collectionsToCleanup: Partial<Record<CollectionsType, boolean>>): Promise<void> {
    const collections = Object.entries(collectionsToCleanup)
      .filter(([_, shouldCleanup]) => shouldCleanup)
      .map(([name]) => name as CollectionsType);

    if (!collections.length) {
      logger.warn('No collections specified for cleanup.');
      return;
    }

    for (const collectionName of collections) {
      const ids = this.trackedAssets[collectionName] || [];
      if (!ids.length) {
        logger.warn(`No tracked assets found in collection: ${collectionName}`);
        continue;
      }

      try {
        const collection: Collection = this.db.collection(collectionName);
        const result = await collection.deleteMany({ _id: { $in: ids } });
        logger.info(
          `Deleted ${result.deletedCount}/${ids.length} assets from collection ${collectionName}`
        );
      } catch (error) {
        logger.error(`Error cleaning collection ${collectionName}:`, error);
      }

      this.trackedAssets[collectionName] = [];
    }

    logger.info('Cleanup complete.');
  }
}
