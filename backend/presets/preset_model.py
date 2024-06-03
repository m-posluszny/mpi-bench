from datetime import datetime
from models.base import CustomBaseModel
from runs.runs_model import ParametersRequest, Run
from typing import List
from uuid import UUID
from enum import Enum


class Status(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    FINISHED = "FINISHED"
    FAILED = "FAILED"


class PresetRequest(CustomBaseModel):
    name: str
    description: str = ""
    parameters: List[ParametersRequest]


class Preset(PresetRequest):
    uid: UUID
    owner_uid: UUID
    created: datetime

    @classmethod
    def _from_row(cls, row):
        return cls(
            uid=row["uid"],
            owner_uid=row["owner_uid"],
            parameters=[ParametersRequest(**p) for p in row["params"]],
            name=row["name"],
            description=row["description"],
            created=row["created"],
        )


class PresetJobRequest(CustomBaseModel):
    preset_uid: UUID
    binary_uid: UUID


class PresetJob(PresetJobRequest):
    uid: UUID
    runs: List[Run]
    created: float
