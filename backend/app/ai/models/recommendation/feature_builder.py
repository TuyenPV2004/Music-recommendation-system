import pandas as pd
import numpy as np

from datetime import datetime
from sklearn.preprocessing import (
    OneHotEncoder,
    StandardScaler,
    MultiLabelBinarizer
)
from scipy.sparse import hstack, csr_matrix


# =========================
# USER FEATURES
# =========================

def _parse_date(x):
    try:
        return pd.to_datetime(x, errors="coerce")
    except:
        return None


def build_user_features(users: pd.DataFrame):

    users = users.copy()

    # ---- birth_date → age ----
    users["birth_date"] = users["birth_date"].apply(_parse_date)

    current_year = datetime.now().year

    users["age"] = current_year - users["birth_date"].dt.year
    users["age"] = users["age"].fillna(users["age"].median())

    # ---- scale age ----
    scaler = StandardScaler()
    age_scaled = scaler.fit_transform(users[["age"]])

    # ---- categorical ----
    encoder = OneHotEncoder(handle_unknown="ignore")

    demo_ohe = encoder.fit_transform(
        users[["gender", "country"]]
    )

    # ---- combine ----
    user_features = hstack([
        csr_matrix(age_scaled),
        demo_ohe
    ])

    artifacts = {
        "user_scaler": scaler,
        "user_ohe": encoder
    }

    return user_features.tocsr(), artifacts


# =========================
# ITEM FEATURES
# =========================

def build_item_features(tracks: pd.DataFrame):

    tracks = tracks.copy()

    # ---- TAG FEATURES ----
    tracks["tags"] = tracks["tags"].fillna("")
    tracks["tags"] = tracks["tags"].apply(lambda x: x.split(","))

    mlb = MultiLabelBinarizer()
    tag_features = mlb.fit_transform(tracks["tags"])

    # ---- NUMERIC AUDIO FEATURES ----
    num_cols = ["danceability", "energy", "valence", "tempo"]

    tracks[num_cols] = tracks[num_cols].fillna(0)

    scaler_item = StandardScaler()
    num_features = scaler_item.fit_transform(tracks[num_cols])

    # ---- combine ----
    item_features = hstack([
        csr_matrix(tag_features),
        csr_matrix(num_features)
    ])

    artifacts = {
        "tag_mlb": mlb,
        "item_scaler": scaler_item
    }

    return item_features.tocsr(), artifacts
