"""
╔══════════════════════════════════════════════════════════╗
║  TÍCH HỢP MODULE - LightFM                               ║  
╚══════════════════════════════════════════════════════════╝

Interface cần giữ nguyên:
  - recommend(user_id: int, k: int) -> list[str]
    Trả về list track_hash (ID gốc từ dataset).
    Backend sẽ query DB bằng track_hash để lấy Song object.

Cách tích hợp:
  1. Load model.pkl, maps.pkl, item_features.pkl (file .pkl đặt cùng thư mục hoặc chỉ đường dẫn)
  2. Implement hàm recommend() giống song_recommendation_module_2.py

Ví dụ code:
  import pickle, numpy as np
  model = pickle.load(open("path/to/model.pkl", "rb"))
  maps = pickle.load(open("path/to/maps.pkl", "rb"))
  item_features = pickle.load(open("path/to/item_features.pkl", "rb"))
  user_map = maps["user_map"]
  track_map = maps["track_map"]
  inv_track_map = {v: k for k, v in track_map.items()}
  num_items = len(track_map)

  def recommend(user_id: int, k: int = 10) -> list[str]:
      if user_id not in user_map:
          return []
      user_idx = user_map[user_id]
      scores = model.predict(user_idx, np.arange(num_items), item_features=item_features)
      top_items = np.argsort(-scores)[:k]
      return [inv_track_map[i] for i in top_items]
"""


# ── PLACEHOLDER ──────────────────────────────────────────
# Khi tích hợp xong, xóa hàm này và thay bằng code.

def recommend(user_id: int, k: int = 10) -> list:
    """
    Placeholder: trả rỗng → Backend sẽ fallback lấy bài hát phổ biến nhất.
    Thành viên B sẽ thay bằng LightFM model thật.
    """
    return []
