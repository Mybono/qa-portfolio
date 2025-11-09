import asyncio
import logging
from pymongo.database import Database
from pymongo.collection import Collection
from bson.objectid import ObjectId
from typing import Optional, Dict, Any, Union
from ..utils import get_random_user 
from ..models import User, UserRoleType
logger = logging.getLogger(__name__)


class UserService:
    """
    A service class responsible for managing CRUD operations 
    for the 'users' MongoDB collection, ensuring all DB calls 
    are non-blocking via asyncio.to_thread.
    """

    def __init__(self, db: Database, collection_name: str = 'users'):
        """
        Initializes UserService by setting up the MongoDB collection.
        """
        self._collection: Collection = db.get_collection(collection_name)
        self._collection_name = collection_name
        logger.debug("UserService initialized for collection: %s", self._collection_name)

    async def create_user(self, user_data: Optional[Dict[str, Any]] = None, user_role: Optional[UserRoleType] = None) -> User:
        data_to_insert = None
        try:
            data_to_insert = user_data if user_data is not None else get_random_user(user_role or 'standard_user')
            result = await asyncio.to_thread(self._collection.insert_one, data_to_insert)
            inserted_doc: User = {**data_to_insert, '_id': result.inserted_id}
            logger.info("Created user with ID: %s", result.inserted_id)
            return inserted_doc
            
        except Exception as error:
            logger.error(
                "Failed to create user. Data: %s", 
                data_to_insert, 
                exc_info=True
            )
            raise RuntimeError(f"UserService.create_user failed: {error}")

    async def find_user(self, query: Dict[str, Any]) -> Optional[User]:
        try:
            doc = await asyncio.to_thread(self._collection.find_one, query)
            
            return doc
            
        except Exception as error:
            logger.error(
                "Failed to find user with query: %s", 
                query, 
                exc_info=True
            )
            raise RuntimeError(f"UserService.find_user failed: {error}")

    async def delete_user(self, user_id: ObjectId) -> bool:
        try:
            result = await asyncio.to_thread(self._collection.delete_one, {"_id": user_id})
            
            logger.info("Deleted %d user(s) with ID: %s", result.deleted_count, user_id)
            
            return result.deleted_count > 0
            
        except Exception as error:
            logger.error(
                "Failed to delete user with ID: %s", 
                user_id, 
                exc_info=True
            )
            raise RuntimeError(f"UserService.delete_user failed: {error}")