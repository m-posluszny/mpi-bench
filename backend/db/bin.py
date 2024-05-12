from uuid import UUID
from models.bin import BinMetaRequest, BinMetaResponse
from db.driver import cursor


def create(cur, uid: UUID, owner_uid: UUID, path: str):
    cur.execute(
        "insert into binaries (uid,  owner_uid, path) values (%s, %s, %s)",
        (str(uid), str(owner_uid), path),
    )


def get(cur: cursor, uid: UUID):
    cur.execute(
        f"select {BinMetaResponse.fields_str()} from binaries where uid = %s",
        (str(uid),),
    )
    row = cur.fetchone()
    if row is None:
        return None
    return BinMetaResponse.from_list(row)


def get_many(cur: cursor, owner_uid: UUID):
    cur.execute(
        f"select {BinMetaResponse.fields_str()} from binaries where owner_uid = %s",
        (str(owner_uid),),
    )
    return [BinMetaResponse.from_list(row) for row in cur.fetchall()]


def update_meta(cur: cursor, uid: UUID, meta: BinMetaRequest):
    fields = BinMetaRequest.fields_set()
    cur.execute(
        f"update binaries set {fields} where uid = %s",
        meta.to_list(),
    )
    return get(cur, uid)


def get_path(cur: cursor, uid: UUID):
    cur.execute(
        "select path from binaries where bin_uid = %s",
        (str(uid),),
    )
    return cur.fetchone()


def delete(cur: cursor, uid: UUID, owner_uid):
    return cur.execute(
        "delete from binaries where uid = %s and owner_uid = %s",
        (str(uid), str(owner_uid)),
    )
