"""
routers/songs.py — CRUD bài hát + Similar Songs
=================================================

THỨ TỰ ĐỌC hiểu file này:
  Đọc sau: models/song.py → ai/similarity.py → file này

BA ENDPOINT:
  GET /api/songs
      └─ Phân trang, tìm kiếm theo tên/nghệ sĩ, lọc genre

  GET /api/songs/{id}
      └─ Chi tiết bài hát + similar_songs
      └─ Similar songs dùng rank_similar_songs() từ ai/similarity.py
      └─ Query param: ?similar_limit=N để frontend điều chỉnh

LƯU Ý vỀ PERFORMANCE:
  rank_similar_songs() load toàn bộ songs vào numpy mỗi request.
  Với ~10k songs việc này rất nhanh (<50ms).
  Nếu DB lớn hơn thì cân nhắc pre-compute và cache.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from ..dependencies import get_db
from ..models.song import Song, Genre
from ..models.interaction import UserSongInteraction
from ..schemas.song import SongBriefWithScore
from ..ai.similarity import rank_similar_songs, DEFAULT_SIMILAR_LIMIT

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
        "title": song.name,
        "artist": song.author or "Unknown",
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
def get_song(
    song_id: int,
    similar_limit: int = Query(DEFAULT_SIMILAR_LIMIT, ge=1, le=30),
    db: Session = Depends(get_db),
):
    """
    Chi tiết một bài hát kèm danh sách bài hát tương tự.

    Similar songs được tính bằng cosine similarity trên 7 audio features.
    Có thể điều chỉnh số lượng qua query param ?similar_limit=N.
    """
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

    # ── Similar songs (cosine similarity) ─────────────────────────────────────
    candidate_songs = (
        db.query(Song)
        .filter(Song.valence.isnot(None), Song.energy.isnot(None))
        .all()
    )
    similar_ranked = rank_similar_songs(
        target_song=song,
        candidate_songs=candidate_songs,
        limit=similar_limit,
    )
    similar_out = [
        SongBriefWithScore(
            id=s.id,
            title=s.name,
            artist=s.author or "Unknown",
            cover=s.audio_link or "",
            similarity=round(score, 4),
        )
        for s, score in similar_ranked
    ]

    return {
        "success": True,
        "data": {
            "id": song.id,
            "title": song.name,
            "artist": song.author,
            "album": song.tags or "",
            "releaseDate": str(song.release_date) if song.release_date else "",
            "duration": _ms_to_time(song.duration),
            "cover": song.audio_link or "",
            "genre": genre_name,
            "listens": f"{total_listens:,}",
            "track_hash": song.track_hash,
            "danceability": song.danceability,
            "energy": song.energy,
            "valence": song.valence,
            "tempo": song.tempo,
        },
        "similar_songs": [s.model_dump() for s in similar_out],
    }
