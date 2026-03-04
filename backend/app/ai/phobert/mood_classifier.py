"""
PhoBERT-based Mood Classifier
Adapted từ module 1/src/mood_classifier.py — chỉ giữ phần cần cho inference.
"""
import torch
import torch.nn as nn
from transformers import AutoModel, AutoConfig

from .config import (
    PHOBERT_MODEL,
    NUM_LABELS,
    LABEL_SMOOTHING,
    ID2LABEL,
)


class PhoBERTMoodClassifier(nn.Module):
    """
    Mô hình phân loại tâm trạng dựa trên PhoBERT.

    Kiến trúc:
        PhoBERT encoder (Mean Pooling) → Dropout → Linear(768→256) → ReLU → Dropout → Linear(256→7)
    """

    def __init__(self, model_name: str = PHOBERT_MODEL, num_labels: int = NUM_LABELS, dropout_rate: float = 0.4):
        super().__init__()

        self.config_hf = AutoConfig.from_pretrained(model_name)
        self.phobert   = AutoModel.from_pretrained(model_name)

        hidden_size = 256
        self.classifier = nn.Sequential(
            nn.Linear(self.config_hf.hidden_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(hidden_size, num_labels),
        )
        self.dropout = nn.Dropout(dropout_rate)
        self._init_weights()

    # ------------------------------------------------------------------
    def _init_weights(self):
        for module in self.classifier:
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                nn.init.zeros_(module.bias)

    # ------------------------------------------------------------------
    def forward(self, input_ids, attention_mask, labels=None):
        outputs = self.phobert(input_ids=input_ids, attention_mask=attention_mask)

        # Mean Pooling — trung bình tất cả token (loại bỏ padding)
        token_embeddings   = outputs.last_hidden_state                              # (B, L, 768)
        mask_expanded      = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        sum_embeddings     = torch.sum(token_embeddings * mask_expanded, dim=1)     # (B, 768)
        sum_mask           = torch.clamp(mask_expanded.sum(dim=1), min=1e-9)        # (B, 768)
        pooled_output      = sum_embeddings / sum_mask                              # (B, 768)

        pooled_output = self.dropout(pooled_output)
        logits        = self.classifier(pooled_output)                              # (B, num_labels)

        loss = None
        if labels is not None:
            loss_fct = nn.CrossEntropyLoss(label_smoothing=LABEL_SMOOTHING)
            loss = loss_fct(logits, labels)

        return {"loss": loss, "logits": logits}

    # ------------------------------------------------------------------
    def predict(self, input_ids, attention_mask):
        """Inference — trả về (predicted_class_ids, probabilities)."""
        with torch.no_grad():
            outputs = self.forward(input_ids, attention_mask)
            logits  = outputs["logits"]
            probs   = torch.softmax(logits, dim=-1)
            preds   = torch.argmax(logits, dim=-1)
        return preds, probs
