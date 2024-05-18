from celery import Celery

from config import BROKER_URL
from db.driver import DbDriver

from config import DATABASE_CONFIG

db = DbDriver(**DATABASE_CONFIG)

worker_app = Celery(broker=BROKER_URL)
