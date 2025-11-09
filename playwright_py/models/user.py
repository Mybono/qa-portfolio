from enum import StrEnum
from pydantic import Field, EmailStr
from models.base import BaseDocument


class UserRole(StrEnum):
    STANDARD_USER = "standard_user"
    LOCKED_OUT_USER = "locked_out_user"
    PROBLEM_USER = "problem_user"
    PERFORMANCE_GLITCH_USER = "performance_glitch_user"
    ERROR_USER = "error_user"
    VISUAL_USER = "visual_user"


class User(BaseDocument):
    username: str = Field(..., min_length=3, max_length=50)
    role: UserRole
    first_name: str
    last_name: str
    postal_code: str = Field(..., pattern=r"^[0-9A-Za-z-]{3,10}$")
    email: EmailStr
    phone: str = Field(..., pattern=r"^\+?\d{7,15}$")
