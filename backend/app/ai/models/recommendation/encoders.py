from sklearn.preprocessing import LabelEncoder


def encode_ids(train_df, test_df):

    user_encoder = LabelEncoder()
    item_encoder = LabelEncoder()

    train_df["user_idx"] = user_encoder.fit_transform(train_df["user_id"])
    train_df["item_idx"] = item_encoder.fit_transform(train_df["track_id"])

    test_df["user_idx"] = user_encoder.transform(test_df["user_id"])
    test_df["item_idx"] = item_encoder.transform(test_df["track_id"])

    return train_df, test_df, user_encoder, item_encoder