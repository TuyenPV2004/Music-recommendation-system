"""
╔══════════════════════════════════════════════════════════╗
║  TÍCH HỢP MODULE 1 - PhoBERT                             ║
╚══════════════════════════════════════════════════════════╝

Interface cần giữ nguyên:
  - predict_mood(text: str) -> dict
  - get_mood_audio_mapping() -> dict

Cách tích hợp:
  1. Import MoodPredictor từ module_1/predict.py
  2. Tạo singleton instance (load model 1 lần khi import)
  3. Implement predict_mood() gọi predictor.predict()

Ví dụ:
  import sys, os
  sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "module_1"))
  from predict import MoodPredictor
  _predictor = MoodPredictor()

  def predict_mood(text: str) -> dict:
      emotion, probs = _predictor.predict(text, return_probs=True)
      return {"detected_mood": emotion, "confidence": probs[emotion], "probabilities": probs}
"""
import json
import os

# Path tới emotion_audio_mapping.json
MAPPING_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "uit_vsmec", "emotion_audio_mapping.json"
)


def get_mood_audio_mapping() -> dict:
    """Load bảng ánh xạ cảm xúc → chỉ số âm nhạc (valence, energy, danceability, ...)"""
    if os.path.exists(MAPPING_PATH):
        with open(MAPPING_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    # Fallback default nếu file chưa có
    return {
        "enjoyment":  {"valence": 0.75, "energy": 0.70, "danceability": 0.70},
        "sadness":    {"valence": 0.20, "energy": 0.30, "danceability": 0.30},
        "anger":      {"valence": 0.30, "energy": 0.85, "danceability": 0.55},
        "fear":       {"valence": 0.25, "energy": 0.60, "danceability": 0.35},
        "surprise":   {"valence": 0.55, "energy": 0.65, "danceability": 0.55},
        "disgust":    {"valence": 0.20, "energy": 0.50, "danceability": 0.35},
        "other":      {"valence": 0.50, "energy": 0.50, "danceability": 0.50},
    }


# ── PLACEHOLDER (keyword matching đơn giản) ─────────────
# Khi tích hợp xong, xóa hàm này và thay bằng code thật.

def predict_mood(text: str) -> dict:
    """
    Placeholder: dùng keyword matching đơn giản.
    Thành viên A sẽ thay bằng PhoBERT predictor thật.
    """
    text_lower = text.lower()
    if any(w in text_lower for w in ["vui", "hạnh phúc", "tuyệt", "yêu", "thích"]):
        return {"detected_mood": "Enjoyment", "confidence": 0.80, "probabilities": {}}
    elif any(w in text_lower for w in ["buồn", "khóc", "chán", "nhớ", "chia tay"]):
        return {"detected_mood": "Sadness", "confidence": 0.80, "probabilities": {}}
    elif any(w in text_lower for w in ["giận", "tức", "ghét", "bực", "điên"]):
        return {"detected_mood": "Anger", "confidence": 0.80, "probabilities": {}}
    elif any(w in text_lower for w in ["sợ", "lo", "hoang mang", "lo lắng"]):
        return {"detected_mood": "Fear", "confidence": 0.80, "probabilities": {}}
    elif any(w in text_lower for w in ["ngạc nhiên", "wow", "bất ngờ", "không ngờ"]):
        return {"detected_mood": "Surprise", "confidence": 0.80, "probabilities": {}}
    elif any(w in text_lower for w in ["kinh", "tởm", "ghê"]):
        return {"detected_mood": "Disgust", "confidence": 0.80, "probabilities": {}}
    else:
        return {"detected_mood": "Other", "confidence": 0.50, "probabilities": {}}
