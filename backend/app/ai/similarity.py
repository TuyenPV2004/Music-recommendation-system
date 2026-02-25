"""
╔═════════════════════════════════════════════════════════════════
║  similarity.py — Cosine Similarity Engine                      ║
╚═════════════════════════════════════════════════════════════════

THỨ TỰ ĐỌC ĐỂ HIỂU LUỒNG HỆ THỐNG:
  1. emotion_audio_mapping.json  ← bảng ánh xạ cảm xúc → audio vector
  2. mood_predictor.py           ← gọi PhoBERT API → trả probabilities
  3. similarity.py  (file này)   ← xây target vector + tính cosine sim
  4. recommendations.py          ← endpoint /mood dùng 1-3
  5. songs.py                    ← endpoint /songs/{id} dùng file này

NHIỆM VỤ của file này:
  Module duy nhất chịu trách nhiệm tính độ tương đồng giữa bài hát.
  Tách biệt hoàn toàn logic toán học ra khỏi router, dễ test độc lập.

HAI USE-CASE:
  1. Mood → Songs   : build_target_vector()  →  rank_songs_by_target()
  2. Song → Similar : rank_similar_songs()  (wrapper gọn của 2 hàm trên)

ĐIỀU CHỈNH HỆ THỐNG:
  Tất cả các con số tuneable đặt tại phần "TUNEABLE CONSTANTS" bên dưới.
  Muốn thay đổi ngưỡng blend, số features, số bài trả về → chỉ sửa ở đó.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:
    from ..models.song import Song


# ══════════════════════════════════════════════════════════════════════════════
# ── TUNEABLE CONSTANTS (chỉnh tại đây, không cần sửa gì ở chỗ khác) ─────────
# ══════════════════════════════════════════════════════════════════════════════

MOOD_BLEND_THRESHOLD: float = 0.60
"""
Ngưỡng xác suất để quyết định blend hay không:
  - top-1 prob >= MOOD_BLEND_THRESHOLD  →  chỉ dùng emotion top-1 (model tự tin)
  - top-1 prob <  MOOD_BLEND_THRESHOLD  →  blend top-1 + top-2, re-normalize về 1
Tăng ngưỡng → kết quả thuần hơn; giảm ngưỡng → cho phép blend nhiều trường hợp hơn.
"""

AUDIO_FEATURES: list[str] = [
    "valence",            # 0–1  (Spotify, không cần transform)
    "energy",             # 0–1
    "danceability",       # 0–1
    "acousticness",       # 0–1
    "instrumentalness",   # 0–1
    "tempo_norm",         # raw tempo / 200, clip 0–1  (BPM thường 60-200)
    "loudness_norm",      # (loudness + 60) / 60, clip 0–1  (dB thường -60–0)
]
"""
Danh sách features dùng để tính cosine similarity.
Thứ tự quan trọng — emotion_audio_mapping.json phải có đúng các key này.
Thêm/bớt feature: chỉ cần sửa list này + cập nhật emotion_audio_mapping.json.
"""

DEFAULT_MOOD_LIMIT: int = 10
"""Số bài hát trả về mặc định cho mood recommendation."""

DEFAULT_SIMILAR_LIMIT: int = 10
"""Số bài hát similar trả về mặc định."""


# ══════════════════════════════════════════════════════════════════════════════
# ── INTERNAL HELPERS ──────────────────────────────────────────────────────────
# ══════════════════════════════════════════════════════════════════════════════

def _song_to_vec(song: "Song") -> np.ndarray | None:
    """
    Chuyển Song ORM object → numpy vector theo thứ tự AUDIO_FEATURES.

    Normalization:
      - valence / energy / danceability / acousticness / instrumentalness: đã 0-1
      - tempo_norm    = tempo / 200,          clip [0, 1]
      - loudness_norm = (loudness + 60) / 60, clip [0, 1]

    Trả về None nếu thiếu cả valence lẫn energy (không đủ để so sánh).
    Các feature phụ bị NULL → điền 0.5 (giá trị trung tính) thay vì bỏ bài.
    """
    raw: dict[str, float | None] = {
        "valence":          song.valence,
        "energy":           song.energy,
        "danceability":     song.danceability,
        "acousticness":     song.acousticness,
        "instrumentalness": song.instrumentalness,
        "tempo_norm":       (song.tempo / 200.0)          if song.tempo    is not None else None,
        "loudness_norm":    ((song.loudness + 60.0) / 60.0) if song.loudness is not None else None,
    }

    # Bắt buộc có ít nhất valence và energy
    if raw["valence"] is None or raw["energy"] is None:
        return None

    vec = np.array(
        [raw[f] if raw[f] is not None else 0.5 for f in AUDIO_FEATURES],
        dtype=np.float64,
    )
    return np.clip(vec, 0.0, 1.0)


def _cosine_similarity_matrix(
    target: np.ndarray,       # shape (D,)
    matrix: np.ndarray,       # shape (N, D)
) -> np.ndarray:              # shape (N,)
    """
    Tính cosine similarity giữa 1 vector target và N vectors (vectorized).
    Tránh chia cho 0 bằng epsilon nhỏ.
    """
    t_norm   = np.linalg.norm(target)
    m_norms  = np.linalg.norm(matrix, axis=1)               # (N,)
    denom    = m_norms * t_norm
    denom    = np.where(denom == 0, 1e-10, denom)
    return (matrix @ target) / denom                         # (N,)


# ══════════════════════════════════════════════════════════════════════════════
# ── PUBLIC API ────────────────────────────────────────────────────────────────
# ══════════════════════════════════════════════════════════════════════════════

def build_target_vector(
    probabilities: dict[str, float],
    emotion_mapping: dict[str, dict],
) -> np.ndarray:
    """
    Xây dựng target audio vector từ PhoBERT probabilities.

    Chiến lược blend (xem MOOD_BLEND_THRESHOLD):
      - Nếu top-1 tự tin (>= threshold) → dùng nguyên emotion vector của top-1.
      - Nếu model lưỡng lự (<  threshold) → blend top-1 + top-2,
        trọng số = p_i / (p1 + p2) để tổng = 1.

    Args:
        probabilities:   { "sadness": 0.72, "fear": 0.15, ... }  từ PhoBERT
        emotion_mapping: nội dung emotion_audio_mapping.json

    Returns:
        numpy array shape (len(AUDIO_FEATURES),), tất cả giá trị trong [0, 1]
    """
    def _emotion_vec(name: str) -> np.ndarray:
        entry = emotion_mapping.get(name.lower(), emotion_mapping.get("other", {}))
        return np.array([entry.get(f, 0.5) for f in AUDIO_FEATURES], dtype=np.float64)

    # Fallback khi không có probabilities (chỉ có detected_mood string)
    if not probabilities:
        return np.full(len(AUDIO_FEATURES), 0.5, dtype=np.float64)

    sorted_probs = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)
    top1_name, top1_prob = sorted_probs[0]

    # ── Tự tin: chỉ dùng top-1 ────────────────────────────────────────────────
    if top1_prob >= MOOD_BLEND_THRESHOLD or len(sorted_probs) < 2:
        return _emotion_vec(top1_name)

    # ── Lưỡng lự: blend top-1 + top-2 ────────────────────────────────────────
    top2_name, top2_prob = sorted_probs[1]
    total = top1_prob + top2_prob
    w1 = top1_prob / total
    w2 = top2_prob / total
    return w1 * _emotion_vec(top1_name) + w2 * _emotion_vec(top2_name)


def rank_songs_by_target(
    songs: list["Song"],
    target_vec: np.ndarray,
    limit: int = DEFAULT_MOOD_LIMIT,
    exclude_ids: set[int] | None = None,
) -> list[tuple["Song", float]]:
    """
    Xếp hạng danh sách songs theo cosine similarity với target_vec.

    Args:
        songs:       Danh sách Song ORM objects cần xếp hạng.
        target_vec:  Vector mục tiêu, shape (len(AUDIO_FEATURES),).
        limit:       Số kết quả tối đa trả về.
        exclude_ids: Set song_id cần loại trừ (ví dụ: bài đang xem).

    Returns:
        List of (Song, similarity_score) sắp xếp giảm dần theo score.
    """
    exclude_ids = exclude_ids or set()

    # Lọc và chuyển sang vector
    valid: list[tuple["Song", np.ndarray]] = []
    for song in songs:
        if song.id in exclude_ids:
            continue
        vec = _song_to_vec(song)
        if vec is not None:
            valid.append((song, vec))

    if not valid:
        return []

    matrix = np.stack([v for _, v in valid])              # (N, D)
    scores = _cosine_similarity_matrix(target_vec, matrix) # (N,)

    top_indices = np.argsort(-scores)[:limit]
    return [(valid[i][0], float(scores[i])) for i in top_indices]


def rank_similar_songs(
    target_song: "Song",
    candidate_songs: list["Song"],
    limit: int = DEFAULT_SIMILAR_LIMIT,
) -> list[tuple["Song", float]]:
    """
    Tìm bài hát tương tự target_song bằng cosine similarity audio features.
    Tự động loại trừ chính target_song khỏi kết quả.

    Args:
        target_song:      Bài hát gốc (đang xem chi tiết).
        candidate_songs:  Pool bài hát để so sánh (thường là toàn bộ DB).
        limit:            Số bài tương tự trả về.

    Returns:
        List of (Song, similarity_score) sắp xếp giảm dần.
    """
    target_vec = _song_to_vec(target_song)
    if target_vec is None:
        return []

    return rank_songs_by_target(
        songs=candidate_songs,
        target_vec=target_vec,
        limit=limit,
        exclude_ids={target_song.id},
    )
