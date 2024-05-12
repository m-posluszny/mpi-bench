from fastapi import FastAPI, Depends, HTTPException, APIRouter
from pydantic import BaseModel, UUID4
from typing import List
from db.driver import DbDriver  # Ensure your DbDriver is accessible
from routes.auth import authorised_user
from uuid import UUID

app = FastAPI()
router = APIRouter()


# Pydantic models for request and response
class Run(BaseModel):
    run_id: UUID4
    binary_id: UUID4
    owner_id: UUID4
    status: str
    start_time: str
    end_time: str
    log_path: str
    result_data: str


class RunCreate(BaseModel):
    binary_id: UUID4
    status: str
    log_path: str
    result_data: str


class RunUpdate(BaseModel):
    status: str
    log_path: str
    result_data: str


@router.get("/api/runs", response_model=List[Run])
async def get_runs(
    user_uid: UUID = Depends(authorised_user), cur=Depends(DbDriver.db_cursor)
):
    sql = "SELECT run_id, binary_id, owner_id, status, start_time, end_time, log_path, result_data FROM runs WHERE owner_id = %s;"
    cur.execute(sql, (str(user_uid),))
    runs = cur.fetchall()
    return [
        {
            "run_id": run[0],
            "binary_id": run[1],
            "owner_id": run[2],
            "status": run[3],
            "start_time": run[4],
            "end_time": run[5],
            "log_path": run[6],
            "result_data": run[7],
        }
        for run in runs
    ]


@router.post("/api/runs", response_model=Run)
async def create_run(
    run: RunCreate,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    sql = "INSERT INTO runs (binary_id, owner_id, status, log_path, result_data) VALUES (%s, %s, %s, %s, %s) RETURNING run_id, binary_id, owner_id, status, start_time, end_time, log_path, result_data;"
    cur.execute(
        sql,
        (str(run.binary_id), str(user_uid), run.status, run.log_path, run.result_data),
    )
    new_run = cur.fetchone()
    return {
        "run_id": new_run[0],
        "binary_id": new_run[1],
        "owner_id": new_run[2],
        "status": new_run[3],
        "start_time": new_run[4],
        "end_time": new_run[5],
        "log_path": new_run[6],
        "result_data": new_run[7],
    }


@router.put("/api/runs/{run_id}", response_model=Run)
async def update_run(
    run_id: UUID,
    run: RunUpdate,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    sql = "UPDATE runs SET status = %s, log_path = %s, result_data = %s WHERE run_id = %s AND owner_id = %s RETURNING run_id, binary_id, owner_id, status, start_time, end_time, log_path, result_data;"
    cur.execute(
        sql, (run.status, run.log_path, run.result_data, str(run_id), str(user_uid))
    )
    updated_run = cur.fetchone()
    if updated_run:
        return {
            "run_id": updated_run[0],
            "binary_id": updated_run[1],
            "owner_id": updated_run[2],
            "status": updated_run[3],
            "start_time": updated_run[4],
            "end_time": updated_run[5],
            "log_path": updated_run[6],
            "result_data": updated_run[7],
        }
    raise HTTPException(
        status_code=404, detail="Run not found or not authorized to update"
    )


@router.delete("/api/runs/{run_id}")
async def delete_run(
    run_id: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    sql = "DELETE FROM runs WHERE run_id = %s AND owner_id = %s;"
    cur.execute(sql, (str(run_id), str(user_uid)))
    if cur.rowcount > 0:
        return {"message": "Run deleted"}
    raise HTTPException(
        status_code=404, detail="Run not found or not authorized to delete"
    )
