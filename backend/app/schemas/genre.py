from pydantic import BaseModel
from typing import List


class GenreResponse(BaseModel):
    id: int
    name: str
    color: str = "bg-blue-500"

    class Config:
        from_attributes = True


class GenreListResponse(BaseModel):
    success: bool = True
    data: List[GenreResponse]
