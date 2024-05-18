from fastapi import Depends, APIRouter, HTTPException
from typing import List
from runs.runs_model import Run, RunRequest
from db.driver import DbDriver
from auth.auth import authorised_user
from uuid import UUID
from presets import preset_db
from presets.preset_model import PresetRequest, Preset


router = APIRouter(prefix="/presets", tags=["presets"])


@router.get("/", response_model=List[Run])
async def get_presets(
    user_uid: UUID = Depends(authorised_user), cur=Depends(DbDriver.db_cursor)
):
    return preset_db.get_all(cur, user_uid)


@router.get("/{uid}", response_model=Run)
async def get_preset(
    uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return preset_db.get(cur, uid, user_uid)


@router.post("/", response_model=Run)
async def create_preset(
    preset: PresetRequest,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return preset_db.create(cur, preset, user_uid)


@router.delete("/{uid}")
async def delete_preset(
    uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    if not preset_db.get(cur, uid, user_uid):
        raise HTTPException(status_code=404, detail="Preset not found")
    preset_db.delete(cur, uid, user_uid)
