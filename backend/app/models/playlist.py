from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, SmallInteger, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


playlist_song_table = Table(
    "playlist_song",
    Base.metadata,
    Column("playlist_id", Integer, ForeignKey("playlist.id", ondelete="CASCADE"), primary_key=True),
    Column("song_id", Integer, ForeignKey("song.id", ondelete="CASCADE"), primary_key=True),
    Column("order_index", Integer, default=0),
)


class Playlist(Base):
    __tablename__ = "playlist"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    user_id    = Column(String(40), ForeignKey("user.user_id", ondelete="CASCADE"), nullable=False)
    name       = Column(String(255), nullable=False)
    is_public  = Column(SmallInteger, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())

    songs = relationship("Song", secondary=playlist_song_table, lazy="joined")
