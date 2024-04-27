from fastapi import APIRouter, UploadFile
from models.bin import BinMeta

router = APIRouter(prefix="/binaries")


@router.get("/")
async def get_binaries():
    return


@router.post("/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}


@router.put("/{uid}")
async def update_metadata(data: BinMeta):
    return


@router.delete("/{uid}")
async def delete_bin(uid: int):
    return
