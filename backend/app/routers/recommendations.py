"""
routers/recommendations.py — Endpoint gợi ý nhạc thông minh
=============================================================

THỨ TỰ ĐỌC hiểu file này:
  Đọc sau: mood_predictor.py → similarity.py → file này

HAI ENDPOINT:
  POST /api/recommendations/mood
      └─ Nhận văn bản tiếng Việt từ frontend
      └─ Gọi PhoBERT API (module 1) lấy probabilities
      └─ build_target_vector(): tính target audio vector (top-1 hoặc blend top-2)
      └─ rank_songs_by_target(): cosine sim trên toàn bộ songs DB
      └─ Trả về: detected_mood + blend_info + songs kèm similarity score

  GET /api/recommendations/hybrid
      └─ Fallback sang LightFM (Module 2) hoặc bài phổ biến nhất

MUốN THAY ĐỔI NGƯỠNG BLEND:
  Sửa MOOD_BLEND_THRESHOLD trong ai/similarity.py, không sửa file này.
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from ..dependencies import get_db, get_current_user
from ..models.user import User
from ..models.song import Song
from ..models.interaction import UserSongInteraction
from ..schemas.recommendation import (
    MoodRequest,
    MoodRecommendationResponse,
    BlendInfo,
    HybridRecommendationResponse,
)
from ..schemas.song import SongBriefWithScore
from ..ai import mood_predictor
from ..ai.similarity import (
    build_target_vector,
    rank_songs_by_target,
    MOOD_BLEND_THRESHOLD,
    DEFAULT_MOOD_LIMIT,
)
from ..services import recommendation_service
from ..services.song import SongService

router = APIRouter()


def _song_to_brief(song: Song) -> dict:
    return {
        "id": song.id,
        "title": song.name,
        "artist": song.author or "Unknown",
        "cover": song.audio_link or "",
    }


def _build_blend_info(probabilities: dict[str, float]) -> BlendInfo:
    """
    Tái tạo thông tin blend để trả về cho client (debug / hiển thị UI).
    Logic giống hệt trong similarity.build_target_vector.
    """
    if not probabilities:
        return BlendInfo(strategy="top1", emotions_used=["other"], weights=[1.0])

    sorted_probs = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)
    top1_name, top1_prob = sorted_probs[0]

    if top1_prob >= MOOD_BLEND_THRESHOLD or len(sorted_probs) < 2:
        return BlendInfo(
            strategy="top1",
            emotions_used=[top1_name],
            weights=[round(top1_prob, 4)],
        )

    top2_name, top2_prob = sorted_probs[1]
    total = top1_prob + top2_prob
    return BlendInfo(
        strategy="blend_top2",
        emotions_used=[top1_name, top2_name],
        weights=[round(top1_prob / total, 4), round(top2_prob / total, 4)],
    )


@router.post("/mood", response_model=MoodRecommendationResponse)
def mood_recommendation(
    data: MoodRequest,
    limit: int = Query(DEFAULT_MOOD_LIMIT, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """
    Nhận text tiếng Việt → phát hiện cảm xúc (Module 1) → trả về bài hát phù hợp.

    Flow:
    1. Gọi PhoBERT API (Module 1) → lấy probabilities 6 emotions
    2. build_target_vector(): top-1 thuần hoặc blend top-2 (theo MOOD_BLEND_THRESHOLD)
    3. rank_songs_by_target(): cosine similarity giữa target với toàn bộ songs trong DB
    4. Trả về top-N bài có score cao nhất kèm blend_info
    """
    # ── Bước 1: Phát hiện mood ────────────────────────────────────────────────
    result = mood_predictor.predict_mood(data.text)
    probabilities: dict[str, float] = result.get("probabilities", {})

    # ── Bước 2: Xây dựng target vector ──────────────────────────────────────────
    emotion_mapping = mood_predictor.get_mood_audio_mapping()
    target_vec = build_target_vector(probabilities, emotion_mapping)

    # ── Bước 3: Lấy pool songs (chỉ những bài có audio features) ──────────────
    candidate_songs = (
        db.query(Song)
        .filter(Song.valence.isnot(None), Song.energy.isnot(None))
        .all()
    )

    # ── Bước 4: Xếp hạng bằng cosine similarity ──────────────────────────────────
    ranked = rank_songs_by_target(candidate_songs, target_vec, limit=limit)

    songs_out = [
        SongBriefWithScore(
            id=song.id,
            title=song.name,
            artist=song.author or "Unknown",
            cover=None,
            preview_url=song.audio_link or None,
            similarity=round(score, 4),
        )
        for song, score in ranked
    ]

    return MoodRecommendationResponse(
        detected_mood=result["detected_mood"],
        confidence=result["confidence"],
        probabilities=probabilities,
        blend_info=_build_blend_info(probabilities),
        songs=songs_out,
    )

@router.get("/recommend/{user_id}", response_model=HybridRecommendationResponse)
def get_recommendations(
    user_id: str,
    #user: User = Depends(get_current_user),
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db)
):

    song_ids = recommendation_service.recommend_ids(user_id, page, page_size)
    print(song_ids)
    songService = SongService(db)
    songs = songService.get_songs_by_ids(song_ids)

    return HybridRecommendationResponse(
        recommendations=[_song_to_brief(s) for s in songs]
    )
