from worker import worker_app
from models.bench import Benchmark
import db.results as db_results


@worker_app.task
def run_benchmark(bench: Benchmark): ...


@worker_app.task
def tsum(*args, **kwargs):
    print(args)
    print(kwargs)
    return sum(args[0])
