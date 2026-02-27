from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from ..dependencies import get_db, get_current_user
from ..models.user import User
from ..models.interaction import UserSongInteraction
from ..schemas.interaction import PlayInteraction, RateInteraction

router = APIRouter()


@router.post("/play")
def record_play(
    data: PlayInteraction,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Ghi nhận lượt nghe: cộng listen_count, update last_listen_at"""
    interaction = (
        db.query(UserSongInteraction)
        .filter_by(user_id=user.user_id, song_id=data.song_id)
        .first()
    )

    if interaction:
        interaction.listen_count += 1
        interaction.last_listen_at = sql_func.now()
        if data.listen_duration:
            interaction.listen_duration = (interaction.listen_duration or 0) + data.listen_duration
    else:
        interaction = UserSongInteraction(
            user_id=user.user_id,
            song_id=data.song_id,
            listen_count=1,
            last_listen_at=sql_func.now(),
            listen_duration=data.listen_duration or 0,
        )
        db.add(interaction)

    db.commit()
    return {"success": True, "message": "Đã ghi nhận lượt nghe"}


@router.post("/rate")
def rate_song(
    data: RateInteraction,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Đánh giá bài hát: update rate (0-5 sao)"""
    if not (0 <= data.rate <= 5):
        raise HTTPException(status_code=400, detail="Rate phải trong khoảng 0-5")

    interaction = (
        db.query(UserSongInteraction)
        .filter_by(user_id=user.user_id, song_id=data.song_id)
        .first()
    )

    if interaction:
        interaction.rate = data.rate
        interaction.last_listen_at = sql_func.now()
    else:
        interaction = UserSongInteraction(
            user_id=user.user_id,
            song_id=data.song_id,
            listen_count=0,
            rate=data.rate,
            last_listen_at=sql_func.now(),
        )
        db.add(interaction)

    db.commit()
    return {"success": True, "message": f"Đã đánh giá {data.rate} sao"}
