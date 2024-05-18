import asyncio
import threading
from worker import db
from tasks import run_benchmark


def watch_for_triggers():
    for cur, conn in db.db_session():
        cur.execute("LISTEN new_run")
        conn.poll()
        for notify in conn.notifies:
            run_benchmark(notify.payload)
            print(notify.payload)
        conn.notifies.clear()


def watchdog():
    while True:
        watch_for_triggers()


def start_watchdog():
    thread = threading.Thread(target=watchdog, daemon=True)
    thread.start()
    return thread
