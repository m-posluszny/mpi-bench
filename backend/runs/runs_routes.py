from pathlib import Path
from fastapi import Depends, APIRouter, HTTPException
from models.base import ManyModel
from runs.runs_model import Run, RunRequest, Status
from db.driver import DbDriver
from auth.auth import authorised_user
from uuid import UUID
from runs import runs_db
from typing import Optional
import config
import os


router = APIRouter(prefix="/runs", tags=["runs"])


@router.get("/", response_model=ManyModel[Run])
async def get_runs(
    job_uid: Optional[UUID] = None,
    status: Optional[Status] = None,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return {"items": runs_db.get_all(cur, user_uid, job_uid, status)}


@router.get("/{run_uid}", response_model=Run)
async def get_run(
    run_uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return runs_db.get(cur, run_uid, user_uid)


@router.get("/{run_uid}/log")
async def get_run_log(
    run_uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    run = runs_db.get(cur, run_uid, user_uid)
    logfile = Path(run.workspace, config.LOG_NAME)
    if not logfile.exists():
        return ""
    return logfile.read_text()


@router.post("/", response_model=Run)
async def create_run(
    run: RunRequest,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return runs_db.create(cur, run, user_uid)


@router.delete("/{run_uid}")
async def delete_run(
    run_uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    if not runs_db.get(cur, run_uid, user_uid):
        raise HTTPException(status_code=404, detail="Run not found")
    runs_db.delete(cur, run_uid, user_uid)
