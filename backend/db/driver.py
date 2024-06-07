from bson import DBRef
import psycopg2
import logging
from psycopg2.extras import LoggingConnection
import psycopg2.pool
from psycopg2._psycopg import cursor

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()


class DbDriver:
    _instance = None

    def __init__(self, dbname, user, password, host="localhost", port=5432):
        if DbDriver._instance:
            return

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
            raise Exception("DatabaseSingleton instance has not been initialized")
        return cls._instance

    def load_sql_file(self, cur, sql_file):
        with open(sql_file, "r") as f:
            sql = f.read()
            cur.execute(sql)

    @classmethod
    def db_session(cls, echo=True):
        conn = cls.get().pool.getconn()
        logger = logging.getLogger("psycopg2")
        if not echo:
            logger.setLevel(logging.INFO)
        conn.initialize(logger)
        try:
            with conn.cursor() as cur:
                cur: cursor
                yield (cur, conn)
                conn.commit()
        except:
            conn.rollback()
            raise
        finally:
            cls.get().pool.putconn(conn)

    @classmethod
    def db_cursor(cls, echo=True):
        for cur, conn in cls.db_session(echo):
            yield cur

    def close_connection(self):
        self.pool.closeall()
        print("PostgreSQL connection is closed")
