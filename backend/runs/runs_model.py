from datetime import datetime
from token import OP

from models.base import CustomBaseModel
from typing import Optional
from uuid import UUID
from enum import Enum
import config


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
    status: Status
    created: datetime
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    duration: Optional[float]
    metrics: Optional[dict]

    @property
    def workspace(self):
        return f"{config.RUN_DIR}/{self.uid}"

    @classmethod
    def _from_row(cls, row):
        return cls(
            uid=row["uid"],
            binary_uid=row["binary_uid"],
            status=row["status"],
            duration=row["duration"],
            created=row["created"],
            metrics=row["metrics"],
            start_time=row["start_time"],
            end_time=row["end_time"],
            parameters=ParametersRequest(**row["param_json"]),
        )
