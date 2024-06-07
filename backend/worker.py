from celery import Celery

from config import BROKER_URL
from db.driver import DbDriver

from config import DATABASE_CONFIG


def get_db():
    return DbDriver(**DATABASE_CONFIG)


worker_app = Celery(broker=BROKER_URL)
