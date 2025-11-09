from pymongo import MongoClient
from pymongo.database import Database

class DbConnection:
    _instance = None
    _db: Database | None = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    async def open_connection(self, connection_string: str) -> Database:
        if self._db is None:
            client = MongoClient(connection_string) 
            self._db = client.get_database() 
        return self._db
    