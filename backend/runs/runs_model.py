from datetime import datetime
from models.base import CustomBaseModel
from typing import Optional
from uuid import UUID
from enum import Enum
import json


class Status(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    FINISHED = "FINISHED"
    FAILED = "FAILED"


class ParametersRequest(CustomBaseModel):
    n_proc: int
    flags: dict


class RunRequest(CustomBaseModel):
    binary_uid: UUID
    parameters: ParametersRequest


class Run(RunRequest):
    uid: UUID
    owner_uid: UUID
    status: str
    start_time: datetime
    end_time: datetime
    duration: float
    created: float
    # log_path: str
    # metrics: dict

    @classmethod
    def _from_row(cls, row):
        param = json.loads(row["param_json"])
        return cls(
            uid=row["uid"],
            owner_uid=row["owner_uid"],
            binary_uid=row["binary_uid"],
            status=row["status"],
            duration=row["duration"],
            created=row["created"],
            start_time=row["start_time"],
            end_time=row["end_time"],
            parameters=ParametersRequest(**param),
        )
