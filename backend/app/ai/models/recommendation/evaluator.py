from lightfm.evaluation import (
    precision_at_k,
    recall_at_k,
    auc_score
)


def evaluate_model(
    model,
    interaction_train,
    interaction_test,
    user_features=None,
    item_features=None
):

    metrics = {}

    metrics["precision@10"] = precision_at_k(
        model,
        interaction_test,
        train_interactions=interaction_train,
        item_features=item_features,
        k=10
    ).mean()

    metrics["recall@10"] = recall_at_k(
        model,
        interaction_test,
        train_interactions=interaction_train,
        item_features=item_features,
        k=10
    ).mean()

    metrics["auc"] = auc_score(
        model,
        interaction_test,
        train_interactions=interaction_train,
        item_features=item_features
    ).mean()

    return metrics
