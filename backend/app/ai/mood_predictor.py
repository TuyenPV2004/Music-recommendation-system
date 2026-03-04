"""
╔══════════════════════════════════════════════════════════╗
║  TÍCH HỢP MODULE 1 - PhoBERT (Direct Import)            ║
╚══════════════════════════════════════════════════════════╝

Interface giữ nguyên:
  - predict_mood(text: str) -> dict
  - get_mood_audio_mapping() -> dict

Cách tích hợp (Direct Import):
  PhoBERT được nhúng trực tiếp vào backend, không cần service riêng.
  Model được lazy-load lần đầu tiên khi gọi predict_mood().

  File model cần đặt tại: backend/app/ai/models/best_model.pt
  (copy từ module 1/models/phobert_mood/best_model.pt)

  Nếu file model không tồn tại → fallback về keyword matching,
  không crash, vẫn hoạt động bình thường.
"""
import json
import os

# Path tới emotion_audio_mapping.json (đặt cạnh file này)
MAPPING_PATH = os.path.join(os.path.dirname(__file__), "emotion_audio_mapping.json")

# Path tới file trọng số PhoBERT đã train
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best_model.pt")

# Lazy-load: khởi tạo 1 lần duy nhất khi gọi predict_mood() lần đầu
_predictor = None


def _get_predictor():
    """Trả về MoodPredictor đã được load. Lazy-load lần đầu gọi."""
    global _predictor
    if _predictor is not None:
        return _predictor
    try:
        from .phobert.predictor import MoodPredictor
        _predictor = MoodPredictor(model_path=MODEL_PATH)
        return _predictor
    except FileNotFoundError as e:
        print(f"⚠️  Không tìm thấy model file: {e}")
        return None
    except Exception as e:
        print(f"⚠️  Không thể load PhoBERT model: {e}")
        return None


def get_mood_audio_mapping() -> dict:
    """Load bảng ánh xạ cảm xúc → chỉ số âm nhạc (valence, energy, danceability, ...)"""
    if os.path.exists(MAPPING_PATH):
        with open(MAPPING_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    # Fallback default nếu file chưa có
    return {
        "enjoyment": {"valence": 0.75, "energy": 0.70, "danceability": 0.70},
        "sadness":   {"valence": 0.20, "energy": 0.30, "danceability": 0.30},
        "anger":     {"valence": 0.30, "energy": 0.85, "danceability": 0.55},
        "fear":      {"valence": 0.25, "energy": 0.60, "danceability": 0.35},
        "surprise":  {"valence": 0.55, "energy": 0.65, "danceability": 0.55},
        "disgust":   {"valence": 0.20, "energy": 0.50, "danceability": 0.35},
        "other":     {"valence": 0.50, "energy": 0.50, "danceability": 0.50},
    }


def predict_mood(text: str) -> dict:
    """
    Dự đoán cảm xúc từ văn bản tiếng Việt.

    Ưu tiên 1: PhoBERT model được load trực tiếp (backend/app/ai/models/best_model.pt)
    Ưu tiên 2: Fallback keyword matching đơn giản (khi file model chưa có)

    Returns:
        dict: { detected_mood, confidence, probabilities }
    """
    # ── Bước 1: Thử dùng PhoBERT trực tiếp ───────────────
    predictor = _get_predictor()
    if predictor is not None:
        try:
            emotion, prob_dict = predictor.predict(text, return_probs=True)
            return {
                "detected_mood": emotion,
                "confidence":    float(prob_dict.get(emotion, 0.0)),
                "probabilities": {k: float(v) for k, v in prob_dict.items()},
            }
        except Exception as e:
            print(f"⚠️  PhoBERT inference lỗi: {e}")

    # ── Bước 2: Fallback keyword matching ─────────────────
    print("⚠️  PhoBERT không khả dụng. Dùng keyword fallback.")

    _KEYWORD_RULES = [
        (["vui", "hạnh phúc", "tuyệt", "yêu", "thích", "phấn khích"],  "Enjoyment", 0.80),
        (["buồn", "khóc", "chán", "nhớ", "chia tay", "cô đơn"],        "Sadness",   0.80),
        (["giận", "tức", "ghét", "bực", "điên", "khó chịu"],           "Anger",     0.80),
        (["sợ", "lo", "hoang mang", "lo lắng", "căng thẳng"],           "Fear",      0.80),
        (["ngạc nhiên", "wow", "bất ngờ", "không ngờ"],                 "Surprise",  0.80),
        (["kinh", "tởm", "ghê", "ghê tởm"],                             "Disgust",   0.80),
    ]

    text_lower = text.lower()
    detected, confidence = "Other", 0.50

    for keywords, label, conf in _KEYWORD_RULES:
        if any(w in text_lower for w in keywords):
            detected, confidence = label, conf
            break

    all_emotions = ["enjoyment", "sadness", "anger", "fear", "surprise", "disgust", "other"]
    residual = (1.0 - confidence) / (len(all_emotions) - 1)
    probabilities = {e: residual for e in all_emotions}
    probabilities[detected.lower()] = confidence

    return {
        "detected_mood": detected,
        "confidence":    confidence,
        "probabilities": probabilities,
    }
