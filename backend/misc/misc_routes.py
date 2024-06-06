from fastapi import APIRouter
from fastapi import Depends
from db.driver import DbDriver
from models.base import ManyModel

router = APIRouter(prefix="/misc", tags=["misc"])


@router.get("/tags")
async def get_tags(
    cur=Depends(DbDriver.db_cursor),
):
    cur.execute("select * from unique_tags")
    return {"items": cur.fetchall()}


@router.get("/branches")
async def get_branches(
    cur=Depends(DbDriver.db_cursor),
):
    cur.execute("select * from unique_branches")
    return {"items": cur.fetchall()}
