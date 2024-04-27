from uuid import UUID
import pydantic
from datetime import datetime


class BinMeta(pydantic.BaseModel):
    filename: str
    branch: str
    commit_id: str
    owner: str
    created: datetime
    bin_uid: UUID
