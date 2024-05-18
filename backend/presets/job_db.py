from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException
from db.driver import cursor
from presets.preset_model import PresetJobRequest, PresetJob


def create(cur: cursor, request: PresetJobRequest, owner_uid: UUID):
    cur.execute()
    row = cur.fetchone()
    if not row:
        raise Exception("this should not happen")
    uid = UUID(row[0])
    return get(cur, uid, owner_uid)


def get_all(cur: cursor, owner_uid: UUID) -> List[PresetJob]:
    cur.execute(
        f"select * from job_view where owner_uid = %s",
        (str(owner_uid),),
    )
    return PresetJob.convert_many(cur)


def get(cur: cursor, uid: UUID, user_uid: Optional[UUID] = None) -> PresetJob:
    q = f"select * from job_view where uid = %s"
    ps = [str(uid)]
    if user_uid:
        q += " and owner_uid = %s"
        ps.append(str(user_uid))
    cur.execute(q, ps)
    return PresetJob.convert_one(cur)


def delete(cur: cursor, uid: UUID, owner_uid: UUID):
    cur.execute(
        f"delete from presets where uid = %s and owner_uid = %s",
        (str(uid), str(owner_uid)),
    )
    if cur.rowcount > 0:
        return {"message": "Preset deleted"}
    raise HTTPException(
        status_code=404, detail="Preset not found or not authorized to delete"
    )
