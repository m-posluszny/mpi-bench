from typing import Optional
from uuid import UUID
from datetime import datetime
from models.base import CustomBaseModel


class BinMetaRequest(CustomBaseModel):
    name: Optional[str]
    branch: Optional[str]
    commit_id: Optional[str]
    tag: Optional[str]


class BinMeta(BinMetaRequest):
    uid: UUID
    owner_uid: UUID
    created: datetime


class BinMetaResponse(BinMetaRequest):
    uid: UUID
    created: datetime
    owner_uid: UUID
    # runs: int = 0
    # last_run_uid: Optional[UUID]
