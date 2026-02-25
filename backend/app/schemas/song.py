from pydantic import BaseModel
from typing import Optional, List


class SongBrief(BaseModel):
    """Dùng cho SongCard component: {id, title, artist, cover}"""
    id: int
    title: str
    artist: Optional[str] = None
    cover: Optional[str] = None


class SongBriefWithScore(SongBrief):
    """SongBrief + cosine similarity score (dùng cho similar songs / mood results)"""
    similarity: Optional[float] = None


class SongDetail(BaseModel):
    """Dùng cho SongDetailPage: full info"""
    id: int
    title: str
    artist: Optional[str] = None
    album: Optional[str] = None
    releaseDate: Optional[str] = None
    duration: Optional[str] = None
    cover: Optional[str] = None
    genre: Optional[str] = None
    listens: Optional[str] = None
    track_hash: Optional[str] = None
    # Spotify audio features
    danceability: Optional[float] = None
    energy: Optional[float] = None
    valence: Optional[float] = None
    tempo: Optional[float] = None


class SongDetailResponse(BaseModel):
    """Response đầy đủ cho GET /songs/{id}: chi tiết + similar songs"""
    success: bool = True
    data: SongDetail
    similar_songs: List[SongBriefWithScore] = []


class SongListResponse(BaseModel):
    success: bool = True
    data: List[SongBrief]
    total: int
    page: int
    limit: int
