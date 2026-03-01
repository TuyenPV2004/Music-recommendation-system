import numpy as np

MIN_USER_INTERACTIONS = 10
MIN_ITEM_INTERACTIONS = 5


def filter_interactions(users, interactions, tracks):

    user_counts = interactions.groupby("user_id").size()
    valid_users = user_counts[user_counts >= MIN_USER_INTERACTIONS].index

    interactions = interactions[
        interactions.user_id.isin(valid_users)
    ]

    item_counts = interactions.groupby("track_id").size()
    valid_items = item_counts[item_counts >= MIN_ITEM_INTERACTIONS].index

    interactions = interactions[
        interactions.track_id.isin(valid_items)
    ]

    interactions["weight"] = np.log1p(interactions["playcount"])

    return interactions