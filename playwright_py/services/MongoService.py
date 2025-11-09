import asyncio
from pymongo.collection import Collection
from pymongo.results import DeleteResult, InsertOneResult
from bson.objectid import ObjectId
from typing import TypeVar, Dict, Any, Optional, Union
T = TypeVar('T', bound=Dict[str, Any])

class MongoService:
    """
    A generic service layer for performing basic CRUD operations on a single MongoDB collection.
    """

    def __init__(self, collection: Collection[T]):
        """
        Initializes the service with a specific pymongo Collection instance.
        """
        self._collection = collection

    async def find_one(self, query: Dict[str, Any]) -> Optional[T]:
       return await asyncio.to_thread(self._collection.find_one, query)
    
    async def insert_one(self, doc: T) -> T:
        result: InsertOneResult = await asyncio.to_thread(self._collection.insert_one, doc)
        return {**doc, '_id': result.inserted_id}

    async def update_one(self, object_id: ObjectId, update: Dict[str, Any]) -> Optional[T]: 
        result: Optional[T] = await asyncio.to_thread(
            self._collection.find_one_and_update,
            {'_id': object_id},
            {'$set': update},
            return_document=True
        )
        return result

    async def delete_one(self, object_id: ObjectId) -> bool: 
        result: DeleteResult = await asyncio.to_thread(self._collection.delete_one, {'_id': object_id})
        return result.deleted_count == 1
    