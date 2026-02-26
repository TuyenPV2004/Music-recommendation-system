from pydantic import BaseModel
from typing import List, Dict, Optional
from .song import SongBrief, SongBriefWithScore


class MoodRequest(BaseModel):
    text: str  # Văn bản tiếng Việt


class BlendInfo(BaseModel):
    """Thông tin về cách blend emotion được thực hiện (debug / UI)"""
    strategy: str                        # "top1" hoặc "blend_top2"
    emotions_used: List[str]             # tên emotion đã dùng
    weights: List[float]                 # trọng số tương ứng


class MoodRecommendationResponse(BaseModel):
    success: bool = True
    detected_mood: str                   # emotion nhãn cao nhất
    confidence: float
    probabilities: Dict[str, float] = {}
    blend_info: Optional[BlendInfo] = None  # chiến lược blend đã dùng
    songs: List[SongBriefWithScore] = []


class HybridRecommendationResponse(BaseModel):
    success: bool = True
    recommendations: List[SongBrief] = []
