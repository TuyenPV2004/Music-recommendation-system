from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, SmallInteger, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


playlist_song_table = Table(
    "Playlist_Song",
    Base.metadata,
    Column("playlist_id", Integer, ForeignKey("Playlist.id", ondelete="CASCADE"), primary_key=True),
    Column("song_id", Integer, ForeignKey("Song.id", ondelete="CASCADE"), primary_key=True),
    Column("order_index", Integer, default=0),
    Column("added_at", DateTime, server_default=func.now()),
)


class Playlist(Base):
    __tablename__ = "Playlist"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    user_id    = Column(String(40), ForeignKey("User.user_id", ondelete="CASCADE"), nullable=False)
    name       = Column(String(255), nullable=False)
    is_public  = Column(SmallInteger, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())

    songs = relationship("Song", secondary=playlist_song_table, lazy="joined")
