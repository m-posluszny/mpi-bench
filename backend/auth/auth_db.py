from db.driver import cursor
from auth.auth_model import UserDB


def get_db_user(cur: cursor, username: str):
    obj = cur.execute(
        "select uid, password_hash from users where username = %s",
        (username,),
    )
    obj = cur.fetchone()
    if not obj:
        return None
    return UserDB(uid=obj[0], password_hash=obj[1])


def create_user(cur: cursor, username: str, password_hash: str):
    cur.execute(
        "insert into users (username, password_hash) values (%s, %s)",
        (username, password_hash),
    )
    return
