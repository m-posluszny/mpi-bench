import json
import glob
import os
import shutil
import config
from pathlib import Path
from time import time
from uuid import UUID
from subprocess import Popen
import subprocess
from worker import worker_app, db
from runs.runs_model import Status, Run
from runs import runs_db
from bin.bin_models import BinMeta
from bin import bin_db


def start_process(binary: BinMeta, n_proc, flags: dict, workdir: str):

    path = f"../../binaries/{binary.uid}"
    flag_flat = [[k, v] for k, v in flags.items()]
    return Popen(
        ["mpirun", "-n", str(n_proc), path, *[x for flag in flag_flat for x in flag]],
        cwd=workdir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )


def generate_metrics(workdir: str):
    metrics = {}
    for file in glob.glob(f"{workdir}/*.json"):
        with open(file, "r") as f:
            data = json.load(f)
            metrics[Path(file).stem] = data
    return metrics


@worker_app.task
def delete_run(run_uid: UUID):
    ws = Run.get_workspace(run_uid)
    print("DELETE RUN", ws)
    shutil.rmtree(ws)


@worker_app.task
def delete_bin(binary_path: str):
    print("DELETE BIN", binary_path)
    os.remove(binary_path)


@worker_app.task
def run_benchmark(run_uid: UUID):
    try:
        for cur in db.db_cursor():
            run = runs_db.get(cur, run_uid)
    except:
        print("Run not found")
        return
    for cur in db.db_cursor():
        runs_db.update(cur, run_uid, Status.RUNNING, 0)
        run = runs_db.get(cur, run_uid)
        bin = bin_db.get_from_run(cur, run_uid)
        params = run.parameters
    os.makedirs(run.workspace)
    log_file = f"{run.workspace}/{config.LOG_NAME}"

    if not bin:
        for cur in db.db_cursor():
            runs_db.update(cur, run_uid, Status.FAILED, 0)
        raise Exception("Bin not found")

    t0 = time()
    p = start_process(bin, params.n_proc, params.flags, run.workspace)
    with open(log_file, "w") as f:
        while True:
            ret_code = p.poll()
            output = p.stdout.readline()
            print(output)
            print(ret_code)
            if output:
                f.write(output)
                f.flush()

            if ret_code is not None:
                # Process has terminated, break the loop
                remaining_output = p.stdout.read()
                f.write(remaining_output)
                f.flush()
                break

        t1 = time() - t0
        metrics = generate_metrics(run.workspace)
        if ret_code != 0:
            for cur in db.db_cursor():
                runs_db.update(cur, run_uid, Status.FAILED, t1, metrics)
            print("SIM FAILED")
        for cur in db.db_cursor():
            runs_db.update(cur, run_uid, Status.FINISHED, t1, metrics)
