from scipy.sparse import coo_matrix


def build_interactions(train_df, test_df):

    interaction_train = coo_matrix(
        (
            train_df["weight"],
            (train_df["user_idx"], train_df["item_idx"])
        )
    )

    interaction_test = coo_matrix(
        (
            test_df["weight"],
            (test_df["user_idx"], test_df["item_idx"])
        )
    )

    return interaction_train, interaction_test