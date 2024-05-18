import config
from time import time
from uuid import UUID
from psutil import Popen
from worker import worker_app, db
from runs.runs_model import ParametersRequest, Run, Status
from runs import runs_db
from bin.bin_models import BinMeta
from bin import bin_db


def start_process(binary: BinMeta, n_proc, flags: dict):

    path = f"{config.BIN_UPLOAD_DIR}/{binary.uid}"
    flag_flat = [[k, v] for k, v in flags.items()]
    return Popen(
        ["mpirun", "-n", str(n_proc), path, *[x for flag in flag_flat for x in flag]]
    )


@worker_app.task
def run_benchmark(run_uid: UUID):
    for cur in db.db_cursor():
        runs_db.update(cur, run_uid, Status.RUNNING, 0)
        run = runs_db.get(cur, run_uid)
        bin = bin_db.get_from_run(cur, run_uid)
        params = run.parameters
    if not bin:
        for cur in db.db_cursor():
            runs_db.update(cur, run_uid, Status.FAILED, 0)
        raise Exception("Bin not found")

    t0 = time()
    p = start_process(bin, params.n_proc, params.flags)
    while p.poll() is None:
        ...
    t1 = time() - t0

    if p.poll() != 0:
        for cur in db.db_cursor():
            runs_db.update(cur, run_uid, Status.FAILED, 0)
        raise Exception("Simulation failed")
    for cur in db.db_cursor():
        runs_db.update(cur, run_uid, Status.FINISHED, 0)
