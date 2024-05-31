from fastapi import HTTPException, Depends, APIRouter
from fastapi_jwt_auth import AuthJWT
from db.driver import DbDriver
from config import Settings
from uuid import UUID
from auth.auth_db import create_user, get_db_user
from auth.auth_model import User


router = APIRouter(prefix="/auth", tags=["auth"])


@AuthJWT.load_config
def get_config():
    return Settings()


def authorised_user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_uid = UUID(Authorize.get_jwt_subject())
    return user_uid


@router.post("/register")
def register(user: User, cur=Depends(DbDriver.db_cursor)):
    db_user = get_db_user(cur, user.username)
    if db_user != None:
        raise HTTPException(
            status_code=400, detail=f"Username already exists - {user.username}"
        )
    create_user(
        cur, username=user.username, password_hash=User.hash_password(user.password)
    )
    return {"msg": "Successfully register"}


@router.post("/login")
def login(user: User, Authorize: AuthJWT = Depends(), cur=Depends(DbDriver.db_cursor)):
    db_user = get_db_user(cur, user.username)
    if db_user is None or (
        db_user is not None
        and user.hash_password(user.password) != db_user.password_hash
    ):
        raise HTTPException(status_code=403, detail="Bad username or password")

    print(db_user.uid)
    print(str(db_user.uid))
    access_token = Authorize.create_access_token(subject=str(db_user.uid))
    refresh_token = Authorize.create_refresh_token(subject=str(db_user.uid))

    Authorize.set_access_cookies(access_token)
    Authorize.set_refresh_cookies(refresh_token)
    return {"msg": "Successfully login"}


@router.post("/refresh")
def refresh(Authorize: AuthJWT = Depends()):
    Authorize.jwt_refresh_token_required()
    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)
    Authorize.set_access_cookies(new_access_token)
    return {"msg": "The token has been refreshed"}


@router.delete("/logout")
def logout(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    Authorize.unset_jwt_cookies()
    return {"msg": "Successfully logout"}
