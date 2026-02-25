from sqlalchemy import (
    Column, Integer, String, Float, Date, DateTime, Text,
    ForeignKey, Table, SmallInteger,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


# Bảng trung gian Song_Mood (N-N)
song_mood_table = Table(
    "Song_Mood",
    Base.metadata,
    Column("song_id", Integer, ForeignKey("Song.id", ondelete="CASCADE"), primary_key=True),
    Column("mood_id", Integer, ForeignKey("Mood.id", ondelete="CASCADE"), primary_key=True),
)


class Genre(Base):
    __tablename__ = "Genre"

    id   = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)


class Mood(Base):
    __tablename__ = "Mood"

    id   = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)


class Song(Base):
    __tablename__ = "Song"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    track_hash       = Column(String(30), unique=True, nullable=False)
    name             = Column(String(512), nullable=False)
    author           = Column(String(512), nullable=True)
    audio_link       = Column(Text, nullable=True)
    spotify_id       = Column(String(50), nullable=True)
    duration         = Column(Integer, nullable=True)           # milliseconds
    release_date     = Column(Date, nullable=True)
    tags             = Column(Text, nullable=True)
    genre_id         = Column(Integer, ForeignKey("Genre.id", ondelete="SET NULL"), nullable=True)
    danceability     = Column(Float, nullable=True)
    energy           = Column(Float, nullable=True)
    song_key         = Column(SmallInteger, nullable=True)
    loudness         = Column(Float, nullable=True)
    mode             = Column(SmallInteger, nullable=True)      # 0=minor, 1=major
    speechiness      = Column(Float, nullable=True)
    acousticness     = Column(Float, nullable=True)
    instrumentalness = Column(Float, nullable=True)
    liveness         = Column(Float, nullable=True)
    valence          = Column(Float, nullable=True)
    tempo            = Column(Float, nullable=True)
    time_signature   = Column(SmallInteger, nullable=True)
    created_at       = Column(DateTime, server_default=func.now())

    # Relationships
    genre = relationship("Genre", lazy="joined")
    moods = relationship("Mood", secondary=song_mood_table, lazy="joined")
