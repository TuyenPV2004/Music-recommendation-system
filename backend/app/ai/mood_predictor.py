import json
import os

# Path tới emotion_audio_mapping.json
MAPPING_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "uit_vsmec", "emotion_audio_mapping.json"
)


def get_mood_audio_mapping() -> dict:
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

import sys
import os

MODULE_1_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "module_1")
sys.path.insert(0, MODULE_1_PATH)

try:
    from predict import MoodPredictor
    _predictor = MoodPredictor(os.path.join(MODULE_1_PATH, "models", "phobert_mood", "best_model.pt"))
except Exception as e:
    print(f"Error initializing PhoBERT model: {e}")
    _predictor = None


def predict_mood(text: str) -> dict:
    if _predictor is None:
        # Fallback keyword matching
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

    try:
        emotion, probs = _predictor.predict(text, return_probs=True)
        return {
            "detected_mood": emotion,
            "confidence": probs[emotion],
            "probabilities": probs
        }
    except Exception as e:
        print(f"Lỗi dự đoán: {e}")
        return {"detected_mood": "Other", "confidence": 0.0, "probabilities": {}}
