from pathlib import Path
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from threading import Lock

BASE_DIR = Path(__file__).resolve().parent  # app/ai
MODEL_DIR = Path("/shared_models/recommendation")

class RecommendationService:
    def __init__(self):
        self.lock = Lock()
        self.active_version_dir = self._get_active_version_dir()
        self._load_artifacts()

    def _get_active_version_dir(self):
        active_file = MODEL_DIR / "active_version.txt"
        with open(active_file, "r") as f:
            version = f.read().strip()
        return MODEL_DIR / "versions" / version

    # LOAD / RELOAD MODEL
    def _load_artifacts(self):

        self.model = joblib.load(self.active_version_dir / "lightfm_model.pkl")
        self.user_encoder = joblib.load(self.active_version_dir / "user_encoder.pkl")
        self.item_encoder = joblib.load(self.active_version_dir / "item_encoder.pkl")

        self.user_features = joblib.load(self.active_version_dir / "user_features_matrix.pkl")
        self.item_features = joblib.load(self.active_version_dir / "item_features_matrix.pkl")
        self.interaction_train = joblib.load(self.active_version_dir / "interaction_train.pkl")

        # 🔥 recompute popularity
        item_popularity = np.array(
            self.interaction_train.sum(axis=0)
        ).ravel()

        self.popular_items_sorted = np.argsort(-item_popularity)

        print("Model & artifacts loaded successfully")

    def reload(self):
        with self.lock:
            self._load_artifacts()
        print("Model reloaded successfully")

    def recommend_ids(self, user_id, page=1, page_size=10):

        if user_id not in self.user_encoder.classes_:
            return self._popular_fallback(page, page_size)

        user_idx = self.user_encoder.transform([user_id])[0]

        n_items = self.item_features.shape[0]
        item_ids = np.arange(n_items)
        user_ids = np.repeat(user_idx, n_items)

        # -------- Stage 1: Predict --------
        scores = self.model.predict(
            user_ids,
            item_ids,
            user_features=self.user_features,
            item_features=self.item_features
        )

        # -------- Lọc item đã nghe --------
        known_items = self.interaction_train.tocsr()[user_idx].indices
        scores[known_items] = -np.inf

        # -------- Stage 2: Retrieval --------
        candidates = np.argsort(-scores)[:300]

        # -------- Stage 3: Dynamic diversity --------
        lambda_penalty = 0.2 + 0.2 * (page - 1)

        reranked = self._rerank_diversity(
            candidates=candidates,
            scores=scores,
            item_embeddings=self.model.item_embeddings,
            K=100,
            lambda_penalty=lambda_penalty
        )

        # -------- Stage 4: Pagination --------
        start = (page - 1) * page_size
        end = start + page_size

        paged_items = reranked[start:end]

        song_ids = self.item_encoder.inverse_transform(paged_items)
        return song_ids.tolist()
    
    # Re-rank strategy
    def _rerank_diversity(self, candidates, scores, item_embeddings,
                        K=100, lambda_penalty=0.3):

        selected = []

        for _ in range(K):

            best_item = None
            best_score = -np.inf

            for item in candidates:

                if item in selected:
                    continue

                base_score = scores[item]

                penalty = 0
                for chosen in selected:
                    sim = cosine_similarity(
                        item_embeddings[item].reshape(1, -1),
                        item_embeddings[chosen].reshape(1, -1)
                    )[0][0]
                    penalty += sim

                final_score = base_score - lambda_penalty * penalty

                if final_score > best_score:
                    best_score = final_score
                    best_item = item

            selected.append(best_item)

        return selected

    # Popular fallback strategy
    def _popular_fallback(self, page, page_size):

        start = (page - 1) * page_size
        end = start + page_size

        top_items = self.popular_items_sorted[start:end]

        song_ids = self.item_encoder.inverse_transform(top_items)

        return song_ids.tolist()