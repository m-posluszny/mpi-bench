from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException
from db.driver import cursor, LoggingConnection
from presets.preset_model import PresetJobRequest, PresetJob


def create(
    session: tuple[cursor, LoggingConnection], r: PresetJobRequest, owner_uid: UUID
):
    cur, conn = session
    cur.execute(
        "call begin_job(%s, %s, %s);", (str(r.preset_uid), str(r.binary_uid), None)
    )
    row = cur.fetchone()
    print(row)
    if not row:
        raise Exception("this should not happen")
    conn.commit()
    uid = UUID(row[0])
    return get(cur, uid, owner_uid)


def get_all(cur: cursor, preset_uid: UUID) -> List[PresetJob]:
    cur.execute(
        f"select * from job_view where preset_uid = %s order by created desc",
        (str(preset_uid),),
    )
    return PresetJob.convert_many(cur)


def get(cur: cursor, uid: UUID, user_uid: Optional[UUID] = None) -> PresetJob:
    q = f"select * from job_view where uid = %s"
    ps = [str(uid)]
    cur.execute(q, ps)
    return PresetJob.convert_one(cur)


def delete(cur: cursor, uid: UUID, owner_uid: UUID):
    cur.execute(
        f"delete from preset_jobs where uid = %s and owner_uid = %s",
        (str(uid), str(owner_uid)),
    )
    if cur.rowcount > 0:
        return {"message": "Job deleted"}
    raise HTTPException(
        status_code=404, detail="Job not found or not authorized to delete"
    )
