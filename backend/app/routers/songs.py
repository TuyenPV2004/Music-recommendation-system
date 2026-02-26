from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from ..dependencies import get_db
from ..models.song import Song, Genre
from ..models.interaction import UserSongInteraction

router = APIRouter()


def _ms_to_time(ms) -> str:
    """Chuyển milliseconds → 'm:ss' format"""
    if not ms:
        return "0:00"
    total_sec = ms // 1000
    mins = total_sec // 60
    secs = total_sec % 60
    return f"{mins}:{secs:02d}"


def _song_to_brief(song: Song) -> dict:
    """Chuyển Song ORM → dict phù hợp cho SongCard component"""
    return {
        "id": song.id,
        "name": song.name,
        "title": song.name,
        "author": song.author or "Unknown",
        "artist": song.author or "Unknown",
        "audio_link": song.audio_link or "",
        "cover": song.audio_link or "",
    }


@router.get("")
def list_songs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query("", description="Tìm theo tên bài hát hoặc nghệ sĩ"),
    genre: int = Query(None, description="Lọc theo genre_id"),
    db: Session = Depends(get_db),
):
    """Danh sách bài hát với phân trang, tìm kiếm, lọc genre"""
    query = db.query(Song)

    if search:
        query = query.filter(
            (Song.name.ilike(f"%{search}%")) | (Song.author.ilike(f"%{search}%"))
        )
    if genre:
        query = query.filter(Song.genre_id == genre)

    total = query.count()
    songs = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "success": True,
        "data": [_song_to_brief(s) for s in songs],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/{song_id}")
def get_song(song_id: int, db: Session = Depends(get_db)):
    """Chi tiết một bài hát"""
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Bài hát không tồn tại")

    # Tính tổng listen_count
    total_listens = (
        db.query(sql_func.sum(UserSongInteraction.listen_count))
        .filter(UserSongInteraction.song_id == song_id)
        .scalar()
        or 0
    )

    genre_name = song.genre.name if song.genre else None

    return {
        "success": True,
        "data": {
            "id": song.id,
            "name": song.name,
            "title": song.name,
            "author": song.author,
            "artist": song.author,
            "album": song.tags or "",
            "releaseDate": str(song.release_date) if song.release_date else "",
            "duration": _ms_to_time(song.duration),
            "duration_ms": song.duration,
            "audio_link": song.audio_link or "",
            "cover": song.audio_link or "",
            "genre": genre_name,
            "genre_id": song.genre_id,
            "listens": f"{total_listens:,}",
            "track_hash": song.track_hash,
            "spotify_id": song.spotify_id,
            "danceability": song.danceability,
            "energy": song.energy,
            "valence": song.valence,
            "tempo": song.tempo,
            "acousticness": song.acousticness,
            "speechiness": song.speechiness,
            "instrumentalness": song.instrumentalness,
            "liveness": song.liveness,
            "loudness": song.loudness,
        },
    }
