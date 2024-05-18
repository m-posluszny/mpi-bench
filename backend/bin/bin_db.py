from uuid import UUID
from bin.bin_models import BinMetaRequest, BinMeta
from db.driver import cursor


def create(cur, uid: UUID, owner_uid: UUID, path: str):
    cur.execute(
        "insert into binaries (uid,  owner_uid, path) values (%s, %s, %s)",
        (str(uid), str(owner_uid), path),
    )


def get(cur: cursor, uid: UUID):
    cur.execute(
        f"select * from binaries where uid = %s",
        (str(uid),),
    )
    return BinMeta.convert_one(cur)


def get_from_run(cur: cursor, run_uid: UUID):
    cur.execute(
        f"select * from binaries join runs on binaries.uid = runs.bin_uid where runs.uid = %s",
        (str(run_uid),),
    )
    return BinMeta.convert_many(cur)


def get_many(cur: cursor, owner_uid: UUID):
    cur.execute(
        f"select * from binaries where owner_uid = %s",
        (str(owner_uid),),
    )
    return BinMeta.convert_many(cur)


def update_meta(cur: cursor, uid: UUID, meta: BinMetaRequest):
    fields = BinMetaRequest.fields_set()
    cur.execute(
        f"update binaries set {fields} where uid = %s",
        meta.to_list(),
    )
    return get(cur, uid)


def delete(cur: cursor, uid: UUID, owner_uid):
    return cur.execute(
        "delete from binaries where uid = %s and owner_uid = %s",
        (str(uid), str(owner_uid)),
    )
