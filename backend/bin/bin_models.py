from typing import Optional
from uuid import UUID
from datetime import datetime
from models.base import CustomBaseModel


class BinMetaRequest(CustomBaseModel):
    name: Optional[str]
    branch: Optional[str]
    commit_uid: Optional[str]
    tag: Optional[str]


class BinMeta(BinMetaRequest):
    uid: UUID
    owner_uid: UUID
    created: datetime
    runs_count: int = 0

    @classmethod
    def _from_row(cls, row):
        return cls(
            uid=row["uid"],
            owner_uid=row["owner_uid"],
            created=row["created"],
            commit_uid=row["commit_uid"],
            tag=row["tag"],
            name=row["name"],
            branch=row["branch"],
            runs_count=row["runs_count"],
        )


class BinMetaResponse(BinMeta): ...
