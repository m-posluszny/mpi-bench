from datetime import datetime
from models.base import CustomBaseModel
from runs.runs_model import ParametersRequest, Run, Status
from typing import List
from uuid import UUID
from enum import Enum


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
    status: Status
    created: datetime

    @classmethod
    def _from_row(cls, row):
        return cls(
            uid=row["uid"],
            preset_uid=row["preset_uid"],
            binary_uid=row["binary_uid"],
            runs=[Run._from_row(r) for r in row["runs_json"]],
            status=row["job_status"],
            created=row["created"],
        )
