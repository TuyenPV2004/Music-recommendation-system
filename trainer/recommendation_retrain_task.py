from celery import shared_task
from datetime import datetime
from pathlib import Path
import joblib
import os
import requests

from app.ai.recommendation.train_pipeline import train_full_pipeline

BASE_DIR = Path("/shared_models/recommendation")
VERSIONS_DIR = BASE_DIR / "versions"
ACTIVE_FILE = BASE_DIR / "active_version.txt"


@shared_task
def full_retrain_task():

    version = datetime.now().strftime("%Y%m%d_%H%M%S")
    version_dir = VERSIONS_DIR / version
    version_dir.mkdir(parents=True, exist_ok=True)

    artifacts = train_full_pipeline()

    joblib.dump(artifacts["model"], version_dir / "lightfm_model.pkl")
    joblib.dump(artifacts["user_encoder"], version_dir / "user_encoder.pkl")
    joblib.dump(artifacts["item_encoder"], version_dir / "item_encoder.pkl")
    joblib.dump(artifacts["user_features"], version_dir / "user_features_matrix.pkl")
    joblib.dump(artifacts["item_features"], version_dir / "item_features_matrix.pkl")
    joblib.dump(artifacts["interaction_train"], version_dir / "interaction_train.pkl")

    tmp_file = ACTIVE_FILE.with_suffix(".tmp")
    with open(tmp_file, "w") as f:
        f.write(version)

    os.replace(tmp_file, ACTIVE_FILE)

    # 🔥 call backend reload
    requests.post("http://backend:8000/reload-model")

    return f"Retrain completed: {version}"
