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
    def poll(conn):
        conn.poll()
        while conn.notifies:
            notify = conn.notifies.pop(0)
            if notify.channel == "new_run":
                Watchdog.on_new_run(notify)
            elif notify.channel == "delete_bin":
                Watchdog.on_delete_bin(notify)

    @staticmethod
    def watch_for_messages():
        for cur, conn in db.db_session(echo=False):
            cur.execute("LISTEN delete_bin;")
            Watchdog.poll(conn)
            cur.execute("LISTEN new_run;")
            Watchdog.poll(conn)
            conn.notifies.clear()

    @staticmethod
    def on_new_run(notify):
        print("RUN", notify.payload)
        run_benchmark(notify.payload)
        print(notify.payload)

    @staticmethod
    def on_delete_bin(notify):
        print("DELETE", notify.payload)
        os.remove(notify.payload)

    @classmethod
    def listener(cls):
        print("Starting listener")
        while cls.RUNNING:
            cls.watch_for_messages()
        print("Listener finished")

    def wait(self):
        print("Waiting for watchdog to finish")
        Watchdog.RUNNING = False
        self.thread.join()
