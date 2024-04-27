import psycopg2
from config import DATABASE_CONFIG

conn = None


def get_connection():
    global conn
    conn = psycopg2.connect(kwargs=DATABASE_CONFIG)
