"""
Inference-only config cho PhoBERT Mood Classifier.
Trích từ module 1/config/training_config.py — chỉ giữ phần cần cho inference.
"""
import torch

# ==================== MODEL ====================
PHOBERT_MODEL = "vinai/phobert-base"

# Emotion labels (7 classes) — thứ tự phải khớp với lúc train
EMOTION_LABELS = [
    "Anger",
    "Disgust",
    "Enjoyment",
    "Fear",
    "Other",
    "Sadness",
    "Surprise",
]

NUM_LABELS = len(EMOTION_LABELS)
LABEL2ID = {label: idx for idx, label in enumerate(EMOTION_LABELS)}
ID2LABEL  = {idx: label for idx, label in enumerate(EMOTION_LABELS)}

# Max sequence length (phải khớp với lúc train)
MAX_LENGTH = 256

# Label smoothing (dùng trong forward, phải khớp với lúc train)
LABEL_SMOOTHING = 0.0

# Device
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
