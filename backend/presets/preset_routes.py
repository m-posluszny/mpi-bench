from fastapi import Depends, APIRouter, HTTPException
from models.base import ManyModel
from db.driver import DbDriver
from auth.auth import authorised_user
from uuid import UUID
from presets import preset_db, job_db
from presets.preset_model import PresetRequest, Preset, PresetJob, PresetJobRequest


router = APIRouter(prefix="/presets", tags=["presets"])


@router.get("/", response_model=ManyModel[Preset])
async def get_presets(
    user_uid: UUID = Depends(authorised_user), cur=Depends(DbDriver.db_cursor)
):
    return {"items": preset_db.get_all(cur, user_uid)}


@router.get("/{uid}/jobs", response_model=ManyModel[PresetJob])
async def get_jobs(
    uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return {"items": job_db.get_all(cur, user_uid)}


@router.post("/{uid}/jobs", response_model=PresetJob)
async def start_job(
    uid: UUID,
    job: PresetJobRequest,
    user_uid: UUID = Depends(authorised_user),
    session=Depends(DbDriver.db_session),
):
    return job_db.create(session, job, user_uid)


@router.post("/", response_model=Preset)
async def create_preset(
    preset: PresetRequest,
    user_uid: UUID = Depends(authorised_user),
    session=Depends(DbDriver.db_session),
):
    return preset_db.create(session, preset, user_uid)


@router.delete("/{uid}")
async def delete_preset(
    uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    if not preset_db.get(cur, uid, user_uid):
        raise HTTPException(status_code=404, detail="Preset not found")
    preset_db.delete(cur, uid, user_uid)
