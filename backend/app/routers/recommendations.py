from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from ..dependencies import get_db, get_current_user
from ..models.user import User
from ..models.song import Song
from ..models.interaction import UserSongInteraction
from ..schemas.recommendation import (
    MoodRequest,
    MoodRecommendationResponse,
    HybridRecommendationResponse,
)
from ..ai import mood_predictor, song_recommender

router = APIRouter()


def _song_to_brief(song: Song) -> dict:
    return {
        "id": song.id,
        "title": song.name,
        "artist": song.author or "Unknown",
        "cover": song.audio_link or "",
    }


@router.post("/mood", response_model=MoodRecommendationResponse)
def mood_recommendation(data: MoodRequest, db: Session = Depends(get_db)):
    """
    Nhận text tiếng Việt → phát hiện cảm xúc (Module 1) → trả về bài hát phù hợp

    Flow:
    1. Phát hiện mood từ text (PhoBERT hoặc placeholder keyword matching)
    2. Lấy mapping cảm xúc → audio features (valence, energy, danceability)
    3. Query songs gần nhất với target audio features từ DB
    """
    # 1. Phát hiện mood
    result = mood_predictor.predict_mood(data.text)
    mood_label = result["detected_mood"].lower()

    # 2. Lấy mapping cảm xúc → audio features
    mapping = mood_predictor.get_mood_audio_mapping()
    target = mapping.get(mood_label, mapping.get("other", {
        "valence": 0.5, "energy": 0.5, "danceability": 0.5
    }))

    target_valence = target.get("valence", 0.5)
    target_energy = target.get("energy", 0.5)
    target_danceability = target.get("danceability", 0.5)

    # 3. Query songs gần nhất với target
    songs = (
        db.query(Song)
        .filter(Song.valence.isnot(None), Song.energy.isnot(None))
        .order_by(
            sql_func.abs(Song.valence - target_valence)
            + sql_func.abs(Song.energy - target_energy)
            + sql_func.abs(Song.danceability - target_danceability)
        )
        .limit(10)
        .all()
    )

    return MoodRecommendationResponse(
        detected_mood=result["detected_mood"],
        confidence=result["confidence"],
        probabilities=result.get("probabilities", {}),
        songs=[_song_to_brief(s) for s in songs],
    )


@router.get("/hybrid", response_model=HybridRecommendationResponse)
def hybrid_recommendation(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Gợi ý bài hát theo user (Module 2 LightFM)

    Flow:
    1. Gọi Module 2 để lấy danh sách track_hash
    2. Nếu có kết quả → query DB lấy Song objects
    3. Nếu Module 2 chưa tích hợp (trả []) → fallback lấy bài phổ biến nhất
    """
    # 1. Gọi Module 2
    track_hashes = song_recommender.recommend(user.id, k=limit)

    if track_hashes:
        # 2. Query songs bằng track_hash
        songs = db.query(Song).filter(Song.track_hash.in_(track_hashes)).all()
    else:
        # 3. Fallback: bài hát phổ biến nhất (nhiều listen_count nhất)
        songs = (
            db.query(Song)
            .join(UserSongInteraction, UserSongInteraction.song_id == Song.id)
            .group_by(Song.id)
            .order_by(sql_func.sum(UserSongInteraction.listen_count).desc())
            .limit(limit)
            .all()
        )

        # Nếu chưa có interaction nào → lấy songs mới nhất
        if not songs:
            songs = db.query(Song).order_by(Song.created_at.desc()).limit(limit).all()

    return HybridRecommendationResponse(
        recommendations=[_song_to_brief(s) for s in songs],
    )
