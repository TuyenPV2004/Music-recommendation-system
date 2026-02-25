"""
╔══════════════════════════════════════════════════════════╗
║  TÍCH HỢP MODULE 1 - PhoBERT                             ║
╚══════════════════════════════════════════════════════════╝

Interface cần giữ nguyên:
  - predict_mood(text: str) -> dict
  - get_mood_audio_mapping() -> dict

Cách tích hợp (Microservice):
  Module 1 chạy như 1 service API độc lập tại port 5001.
  Backend gọi HTTP tới service đó thay vì import trực tiếp.
  → Hai repo hoàn toàn tách biệt, không phụ thuộc nhau.

  Để chạy Module 1 service:
    cd "module 1"
    uvicorn api:app --port 5001

  Nếu service chưa chạy → backend tự fallback về keyword matching,
  không crash, vẫn hoạt động bình thường.
"""
import json
import os
import urllib.request
import urllib.error

# URL của PhoBERT service (Module 1 chạy riêng)
# Đọc từ biến môi trường, mặc định localhost:5001
# Trong Docker: PHOBERT_API_URL=http://host.docker.internal:5001
PHOBERT_API_URL = os.getenv("PHOBERT_API_URL", "http://localhost:5001")

# Path tới emotion_audio_mapping.json (đặt cạnh file này)
# Ánh xạ: tên cảm xúc → {valence, energy, danceability}
MAPPING_PATH = os.path.join(
    os.path.dirname(__file__), "emotion_audio_mapping.json"
)


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


def _call_phobert_service(text: str) -> dict | None:
    """
    Gọi HTTP POST tới PhoBERT service (Module 1).
    Trả về dict kết quả nếu thành công, None nếu service không khả dụng.
    """
    try:
        body = json.dumps({"text": text}).encode("utf-8")
        req = urllib.request.Request(
            f"{PHOBERT_API_URL}/predict",
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except urllib.error.URLError:
        # Service chưa chạy hoặc không kết nối được → dùng fallback
        return None
    except Exception as e:
        print(f"⚠️  PhoBERT service lỗi: {e}")
        return None


def predict_mood(text: str) -> dict:
    """
    Dự đoán cảm xúc từ văn bản tiếng Việt.

    Ưu tiên 1: Gọi PhoBERT service (Module 1) tại PHOBERT_API_URL
    Ưu tiên 2: Fallback keyword matching đơn giản (khi service chưa chạy)

    Returns:
        dict: { detected_mood, confidence, probabilities }
    """
    # ── Bước 1: Thử gọi PhoBERT service ──────────────────
    result = _call_phobert_service(text)
    if result is not None:
        return result  # Trả về kết quả thật từ PhoBERT

    # ── Bước 2: Fallback keyword matching ─────────────────
    # Dùng khi Module 1 service chưa chạy
    print(f"⚠️  PhoBERT service không khả dụng tại {PHOBERT_API_URL}. Dùng keyword fallback.")

    # Keyword rules → (emotion_label, confidence)
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

    # Trả về probabilities đầy đủ để build_target_vector có thể dùng
    all_emotions = ["enjoyment", "sadness", "anger", "fear", "surprise", "disgust", "other"]
    residual = (1.0 - confidence) / (len(all_emotions) - 1)
    probabilities = {e: residual for e in all_emotions}
    probabilities[detected.lower()] = confidence

    return {
        "detected_mood": detected,
        "confidence":    confidence,
        "probabilities": probabilities,
    }
