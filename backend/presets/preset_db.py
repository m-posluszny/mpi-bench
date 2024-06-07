from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException
from db.driver import cursor
from presets.preset_model import PresetRequest, Preset
from psycopg2.extras import Json


def create(session, r: PresetRequest, owner_uid: UUID):
    cur, conn = session
    cur.execute(
        "insert into presets (name, description, owner_uid, trigger_new) values (%s, %s, %s, %s) returning uid",
        (r.name, r.description, str(owner_uid), r.trigger_new),
    )
    row = cur.fetchone()
    if not row:
        raise Exception("this should not happen")
    uid = UUID(row[0])

    args = ((Json(p.flags), p.n_proc, str(uid)) for p in r.parameters)
    args_str = ",".join(cur.mogrify("(%s,%s, %s)", a).decode() for a in args)  # type: ignore
    cur.execute(
        "INSERT INTO parameters (flags, n_proc, preset_uid) VALUES "
        + args_str
        + " RETURNING uid",
    )
    row = cur.fetchone()
    conn.commit()
    if not row:
        raise Exception("this should not happen")
    return get(cur, uid, owner_uid)


def get_all(cur: cursor, owner_uid: UUID, name: str = "") -> List[Preset]:
    q = f"select * from presets_view where owner_uid = %s"
    args = [str(owner_uid)]
    if name:
        q += " and name ilike %s"
        args.append(f"%{name}%")
    q += " order by created desc"
    cur.execute(q, args)
    return Preset.convert_many(cur)


def get(cur: cursor, uid: UUID, user_uid: Optional[UUID] = None) -> Preset:
    q = f"select * from presets_view where uid = %s"
    ps = [str(uid)]
    if user_uid:
        q += " and owner_uid = %s"
        ps.append(str(user_uid))
    cur.execute(q, ps)
    return Preset.convert_one(cur)


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
