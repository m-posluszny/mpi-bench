from fastapi import APIRouter, HTTPException, UploadFile
from fastapi import Depends
from auth.auth import authorised_user
from bin.bin_models import BinMetaRequest, BinMetaResponse
from models.base import ManyModel
from db.driver import DbDriver
from uuid import UUID
import bin.bin_db as db_bin
import uuid
import shutil
import config
import os
import stat

router = APIRouter(prefix="/binaries", tags=["binaries"])


@router.get("/", response_model=ManyModel[BinMetaResponse])
async def get_binaries(
    name: str = "",
    branch: str = "",
    tag: str = "",
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return {"items": db_bin.get_many(cur, user_uid, name, branch, tag)}


@router.post("/")
async def create_upload_file(
    file: UploadFile,
    user_uid: UUID = Depends(authorised_user),
    session=Depends(DbDriver.db_session),
):

    cur, conn = session
    filename = uuid.uuid4()
    file_path = f"{config.BIN_UPLOAD_DIR}/{filename}"
    os.makedirs(config.BIN_UPLOAD_DIR, exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    st = os.stat(file_path)
    os.chmod(file_path, st.st_mode | stat.S_IEXEC)
    db_bin.create(cur, filename, user_uid, file_path)
    conn.commit()
    return db_bin.get(cur, filename)


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
        raise HTTPException(status_code=403, detail="Unauthorized")

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
        raise HTTPException(status_code=403, detail="Unauthorized")
    db_bin.delete(cur, uid, user_uid)
    return {"ok": True}
