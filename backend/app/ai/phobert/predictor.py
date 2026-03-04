"""
MoodPredictor — load PhoBERT model và thực hiện inference.
Adapted từ module 1/predict.py.
"""
import os

import torch
from transformers import AutoTokenizer

from .config import PHOBERT_MODEL, MAX_LENGTH, DEVICE, ID2LABEL, NUM_LABELS
from .mood_classifier import PhoBERTMoodClassifier


class MoodPredictor:
    """
    Load PhoBERT đã fine-tune và dự đoán cảm xúc từ văn bản tiếng Việt.

    Usage:
        predictor = MoodPredictor(model_path="path/to/best_model.pt")
        emotion, probs = predictor.predict("Tôi rất vui hôm nay", return_probs=True)
    """

    def __init__(self, model_path: str | None = None):
        if model_path is None:
            raise ValueError("model_path là bắt buộc.")
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Không tìm thấy file model: {model_path}\n"
                "Hãy chắc chắn file best_model.pt đã được copy vào backend/app/ai/models/"
            )

        # Load tokenizer (lần đầu sẽ tải từ Hugging Face ~400MB rồi cache lại)
        self.tokenizer = AutoTokenizer.from_pretrained(PHOBERT_MODEL)

        # Load model architecture + weights
        self.model = PhoBERTMoodClassifier()
        checkpoint = torch.load(model_path, map_location=DEVICE, weights_only=False)
        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.to(DEVICE)
        self.model.eval()

        print(f"✅ PhoBERT model loaded from {model_path} (device={DEVICE})")

    # ------------------------------------------------------------------
    def predict(self, text: str, return_probs: bool = False):
        """
        Dự đoán cảm xúc từ văn bản tiếng Việt.

        Args:
            text: Văn bản tiếng Việt cần phân loại.
            return_probs: Nếu True, trả về (emotion_name, prob_dict).

        Returns:
            str — tên cảm xúc (return_probs=False)
            (str, dict) — (tên cảm xúc, {label: probability}) (return_probs=True)
        """
        encoding = self.tokenizer(
            text,
            max_length=MAX_LENGTH,
            padding="max_length",
            truncation=True,
            return_tensors="pt",
        )

        input_ids      = encoding["input_ids"].to(DEVICE)
        attention_mask = encoding["attention_mask"].to(DEVICE)

        preds, probs = self.model.predict(input_ids, attention_mask)

        pred_emotion = ID2LABEL[preds.item()]

        if return_probs:
            prob_dict = {ID2LABEL[i]: float(probs[0][i]) for i in range(NUM_LABELS)}
            return pred_emotion, prob_dict

        return pred_emotion
