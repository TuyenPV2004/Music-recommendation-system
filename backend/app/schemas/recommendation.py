from pydantic import BaseModel
from typing import List, Dict, Optional
from .song import SongBrief


class MoodRequest(BaseModel):
    text: str  # Văn bản tiếng Việt


class MoodRecommendationResponse(BaseModel):
    success: bool = True
    detected_mood: str
    confidence: float
    probabilities: Dict[str, float] = {}
    songs: List[SongBrief] = []


class HybridRecommendationResponse(BaseModel):
    success: bool = True
    recommendations: List[SongBrief] = []
