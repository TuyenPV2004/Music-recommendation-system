from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from ..dependencies import get_db
from ..models.user import User
from ..models.song import Song, Genre, Mood
from ..models.interaction import UserSongInteraction
from ..models.playlist import Playlist
from ..services import recommendation_service

router = APIRouter()


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    """Thống kê tổng quan cho Admin DashboardPage"""
    return {
        "success": True,
        "data": {
            "total_users": db.query(User).count(),
            "total_songs": db.query(Song).count(),
            "total_genres": db.query(Genre).count(),
            "total_moods": db.query(Mood).count(),
            "total_playlists": db.query(Playlist).count(),
            "total_interactions": db.query(UserSongInteraction).count(),
        },
    }


@router.get("/users")
def admin_list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(""),
    db: Session = Depends(get_db),
):
    """Quản lý users (UserManagementPage)"""
    query = db.query(User)
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )

    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "success": True,
        "data": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email or "",
                "country": u.country or "",
                "sex": u.sex or "",
                "created_at": str(u.created_at) if u.created_at else "",
            }
            for u in users
        ],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/songs")
def admin_list_songs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(""),
    genre: int = Query(None),
    db: Session = Depends(get_db),
):
    """Quản lý songs (SongManagementPage)"""
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
        "data": [
            {
                "id": s.id,
                "name": s.name,
                "author": s.author or "",
                "genre": s.genre.name if s.genre else "",
                "duration": s.duration,
                "spotify_id": s.spotify_id or "",
                "created_at": str(s.created_at) if s.created_at else "",
            }
            for s in songs
        ],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/genres")
def admin_list_genres(db: Session = Depends(get_db)):
    """Quản lý genres (GenreManagementPage)"""
    genres = db.query(Genre).all()
    # Đếm số song mỗi genre
    result = []
    for g in genres:
        song_count = db.query(Song).filter(Song.genre_id == g.id).count()
        result.append({
            "id": g.id,
            "name": g.name,
            "songCount": song_count,
        })
    return {"success": True, "data": result}


@router.get("/moods")
def admin_list_moods(db: Session = Depends(get_db)):
    """Quản lý moods (MoodManagementPage)"""
    moods = db.query(Mood).all()
    return {
        "success": True,
        "data": [{"id": m.id, "name": m.name} for m in moods],
    }


@router.get("/interactions")
def admin_list_interactions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Quản lý interactions (InteractionManagementPage)"""
    query = db.query(UserSongInteraction)
    total = query.count()
    interactions = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "success": True,
        "data": [
            {
                "id": i.id,
                "user_id": i.user_id,
                "song_id": i.song_id,
                "listen_count": i.listen_count,
                "rate": i.rate,
                "last_listen_at": str(i.last_listen_at) if i.last_listen_at else "",
            }
            for i in interactions
        ],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/playlists")
def admin_list_playlists(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Quản lý playlists (PlaylistManagementPage)"""
    query = db.query(Playlist)
    total = query.count()
    playlists = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "success": True,
        "data": [
            {
                "id": p.id,
                "name": p.name,
                "user_id": p.user_id,
                "songCount": len(p.songs),
                "is_public": bool(p.is_public),
                "created_at": str(p.created_at) if p.created_at else "",
            }
            for p in playlists
        ],
        "total": total,
        "page": page,
        "limit": limit,
    }

@router.post("/reload-model")
def reload_model():
    recommendation_service.reload()
    return {"message": "Model reloaded successfully"}
