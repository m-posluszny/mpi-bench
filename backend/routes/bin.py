from fastapi import APIRouter, HTTPException, UploadFile
from fastapi import Depends
from routes.auth import authorised_user
from models.bin import BinMetaRequest, BinMetaResponse
from models.base import ManyModel
from db.driver import DbDriver
import db.bin as db_bin
import uuid
from uuid import UUID
import shutil
import config
import os

router = APIRouter(prefix="/binaries")


@router.get("/", response_model=ManyModel[BinMetaResponse])
async def get_binaries(
    user_uid: UUID = Depends(authorised_user), cur=Depends(DbDriver.db_cursor)
):
    return {"items": db_bin.get_many(cur, user_uid)}


@router.post("/")
async def create_upload_file(
    file: UploadFile,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):

    filename = uuid.uuid4()
    file_path = f"{config.BIN_UPLOAD_DIR}/{filename}"
    os.makedirs(config.BIN_UPLOAD_DIR, exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    db_bin.create(cur, filename, user_uid, file_path)
    return {"uid": filename}


@router.put("/{uid}", response_model=BinMetaResponse)
async def update_metadata(
    uid: UUID,
    data: BinMetaRequest,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    binary = db_bin.get(cur, uid)
    if not binary:
        raise HTTPException(status_code=404, detail="Not found")
    if user_uid != binary.owner_uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return db_bin.update_meta(cur, uid, data)


@router.delete("/{uid}")
async def delete_bin(
    uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    binary = db_bin.get(cur, uid)
    if not binary:
        raise HTTPException(status_code=404, detail="Not found")
    if user_uid != binary.owner_uid:
        raise HTTPException(status_code=401, detail="Unauthorized")
    db_bin.delete(cur, uid, user_uid)
    return {"ok": True}
