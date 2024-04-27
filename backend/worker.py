from celery import Celery

from config import BROKER_URL


worker_app = Celery(broker=BROKER_URL)
