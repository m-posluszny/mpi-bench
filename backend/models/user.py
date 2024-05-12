from uuid import UUID
from models.base import CustomBaseModel
import hashlib


class User(CustomBaseModel):
    username: str
    password: str

    @classmethod
    def hash_password(cls, password: str):
        return hashlib.sha512(password.encode()).hexdigest()


class UserDB(CustomBaseModel):
    uid: UUID
    password_hash: str
