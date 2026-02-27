from celery import Celery
from celery.schedules import crontab
import os

REDIS_URL = os.getenv("REDIS_URL")

celery = Celery(
    "trainer",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery.conf.timezone = "Asia/Ho_Chi_Minh"

celery.conf.beat_schedule = {
    "full-retrain-nightly": {
        "task": "app.trainer.retrain_task.full_retrain_task",
        "schedule": crontab(hour=3, minute=0),
    },
}
