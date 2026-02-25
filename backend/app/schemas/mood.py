from pydantic import BaseModel
from typing import List


class MoodResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class MoodListResponse(BaseModel):
    success: bool = True
    data: List[MoodResponse]
