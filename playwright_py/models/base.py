from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict


class PyObjectId(ObjectId):
    """Reusable ObjectId validator for MongoDB IDs."""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")


class BaseDocument(BaseModel):
    """Shared base class for all MongoDB documents."""

    id: PyObjectId = Field(alias="_id")
    is_deleted: bool = Field(default=False)
    is_visible: bool = Field(default=True)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        extra="forbid",
    )

    def to_mongo(self) -> dict:
        """Convert model to a MongoDB-compatible dict (keeps _id)."""
        return self.model_dump(by_alias=True)

    def to_public(self) -> dict:
        """Convert model to public-safe dict (hides internal aliases)."""
        return self.model_dump(by_alias=False)
