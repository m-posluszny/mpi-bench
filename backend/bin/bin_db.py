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
        f"select * from bin_view where uid = %s",
        (str(uid),),
    )
    return BinMeta.convert_one(cur)


def get_from_run(cur: cursor, run_uid: UUID):
    cur.execute(
        f"select b.*  from bin_view as b join runs as r on b.uid = r.binary_uid where r.uid = %s",
        (str(run_uid),),
    )
    return BinMeta.convert_one(cur)


def get_many(
    cur: cursor, owner_uid: UUID, name: str = "", branch: str = "", tag: str = ""
):
    q = f"select * from bin_view where owner_uid = %s"
    args = [
        str(owner_uid),
    ]
    if name:
        q += " and name ilike %s"
        args.append(f"%{name}%")
    if branch:
        q += " and branch = %s"
        args.append(branch)
    if tag:
        q += " and tag = %s"
        args.append(tag)
    cur.execute(q, args)
    return BinMeta.convert_many(cur)


def update_meta(cur: cursor, uid: UUID, meta: BinMetaRequest):
    fields = BinMetaRequest.fields_set()
    print(fields, meta.to_list())
    cur.execute(
        f"update binaries set {fields} where uid = %s",
        (*meta.to_list(), str(uid)),
    )
    return get(cur, uid)


def delete(cur: cursor, uid: UUID, owner_uid):
    return cur.execute(
        "delete from binaries where uid = %s and owner_uid = %s",
        (str(uid), str(owner_uid)),
    )
