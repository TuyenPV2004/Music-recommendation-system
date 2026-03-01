from lightfm import LightFM


def train_model(interaction_train, item_features=None):

    model = LightFM(
        loss="bpr",
        no_components=128,
        learning_rate=0.03,
        item_alpha=1e-6,
        user_alpha=1e-6,
        random_state=42
    )

    model.fit(
        interaction_train,
        item_features=item_features,
        epochs=100,
        num_threads=8
    )

    return model