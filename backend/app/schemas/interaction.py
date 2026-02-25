from pydantic import BaseModel


class PlayInteraction(BaseModel):
    song_id: int
    listen_duration: int = 0  # giây


class RateInteraction(BaseModel):
    song_id: int
    rate: float  # 0-5
