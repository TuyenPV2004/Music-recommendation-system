from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class UserResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    birth_date: Optional[date] = None
    country: Optional[str] = None
    sex: Optional[str] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    birth_date: Optional[date] = None
