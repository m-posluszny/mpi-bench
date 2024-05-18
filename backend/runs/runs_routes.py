from fastapi import Depends, APIRouter, HTTPException
from typing import List
from runs.runs_model import Run, RunRequest
from db.driver import DbDriver
from auth.auth import authorised_user
from uuid import UUID
from runs import runs_db


router = APIRouter(prefix="/runs", tags=["runs"])


@router.get("/", response_model=List[Run])
async def get_runs(
    user_uid: UUID = Depends(authorised_user), cur=Depends(DbDriver.db_cursor)
):
    return runs_db.get_all(cur, user_uid)


@router.get("/{run_uid}", response_model=Run)
async def get_run(
    run_uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    return runs_db.get(cur, run_uid, user_uid)


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
