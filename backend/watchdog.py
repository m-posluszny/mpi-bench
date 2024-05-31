import threading
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
                run_benchmark(notify.payload)
                print(notify.payload)
            conn.notifies.clear()

    @classmethod
    def listener(cls):
        print("Starting listener")
        while cls.RUNNING:
            cls.watch_for_triggers()
        print("Listener finished")

    def wait(self):
        print("Waiting for watchdog to finish")
        Watchdog.RUNNING = False
        self.thread.join()
