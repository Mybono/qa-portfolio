from typing import Dict, List
from bson.objectid import ObjectId
from pymongo.database import Database
from models import collections, CollectionsType
import asyncio
import logging
logger = logging.getLogger(__name__)


class AssetsTracker:
    """
    Tracks and cleans up MongoDB assets created during tests.
    Only accepts keys defined in CollectionsType.
    """

    def __init__(self, db: Database):
        self._db_instance: Database = db
        self._tracked_assets: Dict[CollectionsType, List[ObjectId]] = {}

    async def track(self, params: Dict[CollectionsType, ObjectId]) -> None:
        """
        Track an asset by collection name (must be in CollectionsType) and its ObjectId.
        """
        for collection_name, asset_id in params.items():
            if collection_name not in self._tracked_assets:
                self._tracked_assets[collection_name] = []
            self._tracked_assets[collection_name].append(asset_id)
            logger.debug("Tracked asset ID %s in collection %s", asset_id, collection_name)

    async def cleanup(self, collections_to_cleanup: Dict[CollectionsType, bool]) -> None:
        """
        Cleanup tracked assets for the specified collections.
        """
        collections = [c for c, should_cleanup in collections_to_cleanup.items() if should_cleanup]

        if not collections:
            logger.warning("No collections specified for cleanup.")
            return

        for collection_name in collections:
            ids = self._tracked_assets.get(collection_name, [])
            if not ids:
                logger.warning("No tracked assets found in collection: %s", collection_name)
                continue

            try:
                collection = self._db_instance.get_collection(collection_name)
                result = await asyncio.to_thread(
                    collection.delete_many,
                    {"_id": {"$in": ids}}
                )
                logger.info(
                    "Deleted %d/%d assets from collection %s",
                    result.deleted_count,
                    len(ids),
                    collection_name
                )
            except Exception as e:
                logger.error("Error cleaning collection %s: %s", collection_name, e, exc_info=True)

            self._tracked_assets[collection_name] = []

        logger.info("Cleanup complete.")
