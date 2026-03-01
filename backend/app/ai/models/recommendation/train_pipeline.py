from .data_loader import load_data
from .preprocessing import filter_interactions
from .feature_builder import (
    build_user_features,
    build_item_features
)
from .encoders import encode_ids
from .dataset import build_interactions
from .trainer import train_model
from .evaluator import evaluate_model

from sklearn.model_selection import train_test_split
import pandas as pd


def train_full_pipeline():

    users, interactions, tracks = load_data()

    interactions = filter_interactions(users, interactions, tracks)

    # ---------- FEATURES ----------
    user_features, user_feat_artifacts = build_user_features(users)
    item_features, item_feat_artifacts = build_item_features(tracks)

    # ---------- SPLIT ----------
    train_list, test_list = [], []

    for user, df in interactions.groupby("user_id"):
        train, test = train_test_split(df, test_size=0.2, random_state=42)
        train_list.append(train)
        test_list.append(test)

    train_df = pd.concat(train_list)
    test_df = pd.concat(test_list)

    # ---------- ENCODERS ----------
    train_df, test_df, user_encoder, item_encoder = encode_ids(
        train_df, test_df
    )

    # ---------- DATASET ----------
    interaction_train, interaction_test = build_interactions(
        train_df, test_df
    )

    # ---------- TRAIN ----------
    model = train_model(interaction_train, item_features=item_features)

    # ---------- EVALUATE ----------
    metrics = evaluate_model(
        model,
        interaction_train,
        interaction_test,
        user_features=user_features,
        item_features=item_features
    )

    return {
        "model": model,
        "user_encoder": user_encoder,
        "item_encoder": item_encoder,
        "interaction_train": interaction_train,
        "user_features": user_features,
        "item_features": item_features,
        "feature_artifacts": {
            **user_feat_artifacts,
            **item_feat_artifacts
        },

        "metrics": metrics
    }