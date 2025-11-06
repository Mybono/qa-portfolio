import { ObjectId, Collection } from "mongodb";
import { DbConnection } from "../services"; 
import { logger } from "./logger"; 

// --- Data Structure for Tracking ---
// Key: Collection name (e.g., 'users', 'products')
// Value: Array of ObjectIds for documents that need to be deleted
const trackedAssets: Map<string, ObjectId[]> = new Map();

/**
 * Tracks the ID of a created asset for subsequent cleanup.
 * @param params An object where the key is the collection name (e.g., 'users'), 
 * and the value is the ObjectId of the created document.
 * @example 
 * trackCreatedAssets({ users: standardUser._id });
 */
export const trackCreatedAssets = (params: Record<string, ObjectId>): void => {
    // Get the collection name and ID from the passed object
    const collectionName = Object.keys(params)[0];
    const assetId = params[collectionName];

    if (!collectionName || !assetId) {
        logger.error("[AssetTracker]: Invalid input passed to trackCreatedAssets.");
        return;
    }

    if (!trackedAssets.has(collectionName)) {
        trackedAssets.set(collectionName, []);
    }
    
    trackedAssets.get(collectionName)!.push(assetId);
    logger.debug(`[AssetTracker]: Tracked asset in collection '${collectionName}' with ID: ${assetId.toHexString()}`);
};

/**
 * Deletes all tracked assets from the specified collections.
 * @param collectionsToCleanup An object where the keys are collection names (e.g., 'users'), 
 * and the value 'true' indicates that cleanup is required.
 * @example 
 * deleteCreatedAssets({ users: true, products: true });
 */
export const deleteTrackedAssets = async (collectionsToCleanup: Record<string, boolean>): Promise<void> => {

    const dbConnection = DbConnection.getInstance();
    
    // Filter collections that need to be cleaned up
    const collections = Object.keys(collectionsToCleanup).filter(key => collectionsToCleanup[key]);

    if (collections.length === 0) {
        logger.warn("[deleteTrackedAssets]: No collections specified for cleanup. Exiting.");
        return;
    }

    try {
        const db = await dbConnection.openConnection();

        for (const collectionName of collections) {
            const ids = trackedAssets.get(collectionName);

            if (!ids || ids.length === 0) {
                logger.warn(`[AssetTracker]: No tracked assets found for collection '${collectionName}'. Skipping.`);
                continue;
            }

            logger.info(`[AssetTracker]: Preparing to delete ${ids.length} assets from collection '${collectionName}'...`);

            try {
                const collection: Collection = db.collection(collectionName);
                
                // Use deleteMany with the $in operator for efficient bulk deletion
                const result = await collection.deleteMany({ 
                    _id: { $in: ids } 
                });

                logger.info(`[AssetTracker]: Successfully deleted ${result.deletedCount} out of ${ids.length} assets from collection '${collectionName}'.`);

            } catch (error) {
                // Log the error but continue cleanup in the following collections for scalability
                logger.error(`[AssetTracker]: Error deleting assets from collection '${collectionName}': ${error}`);
            }

            // Clear the list of IDs for this collection after the operation is complete
            trackedAssets.set(collectionName, []);
        }
    } catch (dbError) {
        // Critical error: problem with the database connection for cleanup
        logger.error(`[AssetTracker]: CRITICAL DATABASE CONNECTION ERROR during cleanup: ${dbError}`);
    }
    
    logger.info("[AssetTracker]: Cleanup finished.");
};