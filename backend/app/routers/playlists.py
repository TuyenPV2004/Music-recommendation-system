from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..dependencies import get_db, get_current_user
from ..models.user import User
from ..models.song import Song
from ..models.playlist import Playlist, playlist_song_table
from ..schemas.playlist import PlaylistCreate, AddSongRequest

router = APIRouter()


def _song_to_brief(song: Song) -> dict:
    return {
        "id": song.id,
        "title": song.name,
        "artist": song.author or "Unknown",
        "cover": song.audio_link or "",
    }


@router.get("")
def list_playlists(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Danh sách playlist của user hiện tại"""
    playlists = db.query(Playlist).filter(Playlist.user_id == user.user_id).all()
    result = []
    for p in playlists:
        song_count = len(p.songs)
        cover = p.songs[0].audio_link if p.songs else ""
        result.append({
            "id": p.id,
            "name": p.name,
            "songCount": song_count,
            "cover": cover or "",
        })
    return {"success": True, "data": result}


@router.post("")
def create_playlist(
    data: PlaylistCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Tạo playlist mới"""
    playlist = Playlist(
        user_id=user.user_id,
        name=data.name,
        is_public=int(data.is_public),
    )
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    return {
        "success": True,
        "data": {"id": playlist.id, "name": playlist.name, "songCount": 0, "cover": ""},
    }


@router.get("/{playlist_id}")
def get_playlist(playlist_id: int, db: Session = Depends(get_db)):
    """Chi tiết playlist (bao gồm danh sách bài hát)"""
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist không tồn tại")

    # Lấy tên người tạo
    owner = db.query(User).filter(User.user_id == playlist.user_id).first()

    return {
        "success": True,
        "data": {
            "id": playlist.id,
            "name": playlist.name,
            "description": "",
            "cover": playlist.songs[0].audio_link if playlist.songs else "",
            "creator": owner.name if owner else "Unknown",
            "songs": [_song_to_brief(s) for s in playlist.songs],
        },
    }


@router.post("/{playlist_id}/songs")
def add_song_to_playlist(
    playlist_id: int,
    data: AddSongRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Thêm bài hát vào playlist"""
    # Kiểm tra playlist thuộc user
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id, Playlist.user_id == user.user_id
    ).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist không tồn tại")

    # Kiểm tra song tồn tại
    song = db.query(Song).filter(Song.id == data.song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Bài hát không tồn tại")

    # Kiểm tra đã có trong playlist chưa
    existing = db.execute(
        playlist_song_table.select().where(
            (playlist_song_table.c.playlist_id == playlist_id)
            & (playlist_song_table.c.song_id == data.song_id)
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bài hát đã có trong playlist")

    # Thêm vào
    db.execute(
        playlist_song_table.insert().values(
            playlist_id=playlist_id,
            song_id=data.song_id,
            order_index=len(playlist.songs),
        )
    )
    db.commit()
    return {"success": True, "message": "Đã thêm bài hát vào playlist"}


@router.delete("/{playlist_id}/songs/{song_id}")
def remove_song_from_playlist(
    playlist_id: int,
    song_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Xóa bài hát khỏi playlist"""
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id, Playlist.user_id == user.user_id
    ).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist không tồn tại")

    db.execute(
        playlist_song_table.delete().where(
            (playlist_song_table.c.playlist_id == playlist_id)
            & (playlist_song_table.c.song_id == song_id)
        )
    )
    db.commit()
    return {"success": True, "message": "Đã xóa bài hát khỏi playlist"}


@router.delete("/{playlist_id}")
def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Xóa playlist"""
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id, Playlist.user_id == user.user_id
    ).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist không tồn tại hoặc bạn không có quyền")

    db.delete(playlist)
    db.commit()
    return {"success": True, "message": "Đã xóa playlist"}
