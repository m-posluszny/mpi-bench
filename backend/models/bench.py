import pydantic
from typing import Optional
from uuid import UUID
from datetime import datetime


class BenchmarkRequest(pydantic.BaseModel):
    uid: UUID
    start: datetime
    proc_cnt: int
    bin_uid: UUID
    parameters: dict
    name: str


class Benchmark(BenchmarkRequest):
    uid: UUID
    result_uid: Optional[UUID]


class Result(pydantic.BaseModel):
    uid: UUID
    bench_uid: UUID
    time_s: float


class FullResult(Result):
    bin_uid: UUID
    start: datetime
    name: str
    time_s: float
    proc_cnt: int
    parameters: dict


class Batch(pydantic.BaseModel):
    uid: UUID
    name: str
    bench_uids: list[UUID]


class Comparison(pydantic.BaseModel):
    uid: UUID
    name: str
    param_set_uid: UUID
    batch_uids: list[UUID]
