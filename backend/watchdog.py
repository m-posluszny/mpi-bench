import threading
import os
from typing import final
import config
from worker import get_db
import tasks
import select


class Watchdog:
    RUNNING = True

    def __init__(self):
        Watchdog.RUNNING = True
        self.thread = threading.Thread(target=self.listener)
        self.thread.daemon = True
        self.thread.start()

    @staticmethod
    def poll(conn):
        conn.poll()
        while conn.notifies:
            notify = conn.notifies.pop(0)
            if notify.channel == "new_run":
                tasks.run_benchmark.delay(notify.payload)
            elif notify.channel == "delete_bin":
                tasks.delete_bin.delay(notify.payload)
            elif notify.channel == "delete_run":
                tasks.delete_run.delay(notify.payload)

    @classmethod
    def listener(cls):
        print("Starting listener")
        for cur, conn in get_db().db_session(echo=True):
            cur.execute("LISTEN delete_bin;")
            cur.execute("LISTEN delete_run;")
            cur.execute("LISTEN new_run;")
            cur.execute("commit")
            try:
                while cls.RUNNING:
                    if select.select([conn], [], [], 5) == ([], [], []):
                        print("Timeout")
                    else:
                        Watchdog.poll(conn)
            finally:
                cur.execute("UNLISTEN *;")
                conn.close()
        print("Listener finished")

    def wait(self):
        print("Waiting for watchdog to finish")
        Watchdog.RUNNING = False
        self.thread.join()
