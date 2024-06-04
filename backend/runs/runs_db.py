from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException
from db.driver import cursor
from runs.runs_model import RunRequest, Run, Status
import json


def update(cur, run_uid: UUID, status: Status, duration: float, metrics: dict = {}):
    cur.execute(
        "update runs set status = %s, duration = %s, metrics = %s where runs.uid = %s",
        (status, duration, json.dumps(metrics), str(run_uid)),
    )


def create(cur: cursor, request: RunRequest, owner_uid: UUID):
    p = request.parameters
    cur.execute(
        "insert into parameters (flags, n_proc) values (%s, %s) returning uid",
        (p.flags, p.n_proc),
    )
    param_uid = cur.fetchone()
    if not param_uid:
        raise Exception("this should not happen")

    cur.execute(
        "call create_run(%s, %s, %s)",
        (str(request.binary_uid), str(owner_uid), param_uid),
    )
    row = cur.fetchone()
    if not row:
        raise Exception("this should not happen")
    uid = UUID(row[0])
    return get(cur, uid, owner_uid)


def get_all(cur: cursor, owner_uid: UUID) -> List[Run]:
    cur.execute(
        f"select * from runs_view where owner_uid = %s",
        (str(owner_uid),),
    )
    return Run.convert_many(cur)


def get(cur: cursor, uid: UUID, user_uid: Optional[UUID] = None) -> Run:
    q = f"select * from runs_view where uid = %s"
    ps = [str(uid)]
    if user_uid:
        q += " and owner_uid = %s"
        ps.append(str(user_uid))
    cur.execute(q, ps)
    return Run.convert_one(cur)


def delete(cur: cursor, uid: UUID, owner_uid: UUID):
    cur.execute(
        f"delete from runs where uid = %s and owner_uid = %s",
        (str(uid), str(owner_uid)),
    )
    if cur.rowcount > 0:
        return {"message": "Run deleted"}
    raise HTTPException(
        status_code=404, detail="Run not found or not authorized to delete"
    )
