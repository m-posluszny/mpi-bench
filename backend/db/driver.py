import psycopg2
import logging
from psycopg2.extras import LoggingConnection
import psycopg2.pool
from psycopg2._psycopg import cursor

logger = logging.getLogger()


class DbDriver:
    _instance = None

    def __init__(self, dbname, user, password, host="localhost", port=5432):
        if self._instance is not None:
            raise Exception(
                "DatabaseSingleton instance already exists. Use get_instance() method to access it."
            )

        self.pool = psycopg2.pool.ThreadedConnectionPool(
            minconn=4,
            maxconn=16,
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
            connection_factory=LoggingConnection,
        )
        print("Connected to PostgreSQL database!")
        DbDriver._instance = self

    @classmethod
    def get(cls) -> "DbDriver":
        if cls._instance is None or cls._instance.pool.closed != 0:
            raise Exception(
                "DatabaseSingleton instance has not been initialized. Use init_singleton() to initialize it."
            )
        return cls._instance

    def load_sql_file(self, sql_file):
        with open(sql_file, "r") as f:
            sql = f.read()
            for cur in self.db_cursor():
                cur.execute(sql)

    @classmethod
    def db_cursor(cls):
        conn = cls.get().pool.getconn()
        conn.initialize(logger)
        try:
            with conn.cursor() as cur:
                cur: cursor
                yield cur
                conn.commit()
        except:
            conn.rollback()
            raise
        finally:
            cls.get().pool.putconn(conn)

    def close_connection(self):
        self.pool.closeall()
        print("PostgreSQL connection is closed")
