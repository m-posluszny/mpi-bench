from fastapi import APIRouter, UploadFile
from models.sim import Benchmark, Result, FullResult, Batch, Comparison

router = APIRouter(prefix="/benchmark")


@router.get("/")
async def get_benchmarks():
    return


@router.post("/", response_model=Benchmark)
async def create_benchmark(data: Benchmark):
    """
    Runs a benchmark, returns a uid to track status
    """
    return {"filename": file.filename}


@router.put("/{uid}")
async def update_metadata(data: BinMeta):
    return


@router.delete("/{uid}")
async def delete_bin(uid: int):
    return
