from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException
from db.driver import cursor
from presets.preset_model import PresetRequest, PresetJob


def create(cur: cursor, r: PresetRequest, owner_uid: UUID):
    cur.execute(
        "insert into presets (name, description, owner_uid) values (%s, %s, %s) returning uid",
        (r.name, r.description, str(owner_uid)),
    )
    row = cur.fetchone()
    if not row:
        raise Exception("this should not happen")
    uid = UUID(row[0])

    args = ((p.flags, p.n_proc, uid) for p in r.parameters)
    args_str = ",".join(cur.mogrify("(%s,%s, %s)", a) for a in args)  # type: ignore
    cur.execute(
        "INSERT INTO parameters (flags, n_proc, preset_uid) VALUES " + args_str,
    )
    row = cur.fetchone()
    if not row:
        raise Exception("this should not happen")
    uid = UUID(row[0])
    return get(cur, uid, owner_uid)


def get_all(cur: cursor, owner_uid: UUID) -> List[PresetJob]:
    cur.execute(
        f"select * from presets_view where owner_uid = %s",
        (str(owner_uid),),
    )
    return PresetJob.convert_many(cur)


def get(cur: cursor, uid: UUID, user_uid: Optional[UUID] = None) -> PresetJob:
    q = f"select * from presets_view where uid = %s"
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
