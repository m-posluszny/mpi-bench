from typing import Optional
from uuid import UUID
from datetime import datetime
from models.base import CustomBaseModel
from enum import Enum


class Status(str, Enum):
    running = "running"
    done = "done"
    error = "error"


class BenchmarkRequest(CustomBaseModel):
    preset_uid: UUID
    bin_uid: UUID
    proc_cnt: int
    name: str


class Benchmark(BenchmarkRequest):
    uid: UUID
    owner_uid: UUID
    status: Status
    start: datetime
    end: datetime
    result_uid: Optional[UUID]


class Result(CustomBaseModel):
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
