import threading
import os
from typing import final
import config
from worker import db
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
        if conn.notifies:
            print(conn.notifies)
        while conn.notifies:
            print("DO SOMEThiNG")
            notify = conn.notifies.pop(0)
            print("SCHEDULING", notify)
            if notify.channel == "new_run":
                Watchdog.on_new_run(notify)
            elif notify.channel == "delete_bin":
                Watchdog.on_delete_bin(notify)
            elif notify.channel == "delete_run":
                Watchdog.on_delete_run(notify)

    @staticmethod
    def on_new_run(notify):
        print("RUN", notify.payload)
        tasks.run_benchmark.delay(notify.payload)

    @staticmethod
    def on_delete_bin(notify):
        print("DELETE", notify.payload)
        tasks.delete_bin.delay(notify.payload)

    @staticmethod
    def on_delete_run(notify):
        print("DELETE", notify.payload)
        tasks.delete_run.delay(notify.payload)

    @classmethod
    def listener(cls):
        print("Starting listener")
        for cur, conn in db.db_session(echo=True):
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
