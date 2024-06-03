import threading
import os
import config
from worker import db
from tasks import run_benchmark


class Watchdog:
    RUNNING = True

    def __init__(self):
        Watchdog.RUNNING = True
        self.thread = threading.Thread(target=self.listener)
        self.thread.daemon = True
        self.thread.start()

    @staticmethod
    def watch_for_triggers():
        for cur, conn in db.db_session(echo=False):
            cur.execute("LISTEN new_run")
            conn.poll()
            for notify in conn.notifies:
                print("RUN", notify.payload)
                run_benchmark(notify.payload)
                print(notify.payload)
            conn.notifies.clear()

    @staticmethod
    def watch_for_cleaning():
        for cur, conn in db.db_session(echo=False):
            cur.execute("LISTEN delete_bin")
            conn.poll()
            for notify in conn.notifies:
                print("DELETE", notify.payload)
                os.remove(notify.payload)
            conn.notifies.clear()

    @classmethod
    def listener(cls):
        print("Starting listener")
        while cls.RUNNING:
            cls.watch_for_triggers()
            cls.watch_for_cleaning()
        print("Listener finished")

    def wait(self):
        print("Waiting for watchdog to finish")
        Watchdog.RUNNING = False
        self.thread.join()
