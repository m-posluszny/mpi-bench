from fastapi import APIRouter, UploadFile
from models.bench import Benchmark, Result, FullResult, Comparison, BenchmarkRequest
import db.bench as db_bench
from tasks import run_benchmark

router = APIRouter(prefix="/benchmark")


@router.get("/")
async def get_benchmarks():
    return


@router.post("/", response_model=Benchmark)
async def create_benchmark(data: BenchmarkRequest, user_uid: int):
    """
    Runs a benchmark, returns a uid to track status
    """
    run_benchmark.delay()
    db_bench.create_benchmark(data, user_uid)
    return


@router.get("/{uid}/result")
async def get_benchmark_result(uid: int):
    return


@router.delete("/{uid}")
async def delete_benchmark(uid: int):
    return
