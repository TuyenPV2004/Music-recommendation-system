from pydantic import BaseModel
from typing import Optional, List
from .song import SongBrief


class PlaylistCreate(BaseModel):
    name: str
    is_public: bool = False


class PlaylistBrief(BaseModel):
    """Dùng cho PlaylistsPage grid: {id, name, songCount, cover}"""
    id: int
    name: str
    songCount: int
    cover: Optional[str] = None


class PlaylistDetailResponse(BaseModel):
    """Dùng cho PlaylistDetailPage"""
    id: int
    name: str
    description: Optional[str] = ""
    cover: Optional[str] = None
    creator: Optional[str] = None
    songs: List[SongBrief] = []


class AddSongRequest(BaseModel):
    song_id: int
