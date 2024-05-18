from fastapi import Depends, HTTPException, APIRouter
from typing import List
from db.driver import DbDriver
from backend.auth.auth import authorised_user
from uuid import UUID
from models.presets import Preset, PresetRequest

router = APIRouter(prefix="/api/presets")


@router.get("", response_model=List[Preset])
async def get_presets(
    user_uid: UUID = Depends(authorised_user), cur=Depends(DbDriver.db_cursor)
):
    sql = "SELECT preset_uid, owner_uid, description FROM presets WHERE owner_uid = %s;"
    cur.execute(sql, (str(user_uid),))
    presets = cur.fetchall()
    return [
        {"preset_uid": preset[0], "owner_uid": preset[1], "description": preset[2]}
        for preset in presets
    ]


@router.post("", response_model=Preset)
async def create_preset(
    preset: PresetRequest,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    sql = "INSERT INTO presets (owner_uid, description) VALUES (%s, %s) RETURNING preset_uid, owner_uid, description;"
    cur.execute(sql, (str(user_uid), preset.description))
    new_preset = cur.fetchone()
    return {
        "preset_uid": new_preset[0],
        "owner_uid": new_preset[1],
        "description": new_preset[2],
    }


@router.put("{preset_uid}", response_model=Preset)
async def update_preset(
    preset_uid: UUID,
    preset: PresetRequest,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    cur.execute(
        "SELECT owner_uid FROM presets WHERE preset_uid = %s;", (str(preset_uid),)
    )
    existing_preset = cur.fetchone()
    if not existing_preset or existing_preset[0] != str(user_uid):
        raise HTTPException(
            status_code=404 if not existing_preset else 401,
            detail="Not found or Unauthorized",
        )

    cur.execute(
        "UPDATE presets SET description = %s WHERE preset_uid = %s RETURNING preset_uid, owner_uid, description;",
        (preset.description, str(preset_uid)),
    )
    updated_preset = cur.fetchone()
    return {
        "preset_uid": updated_preset[0],
        "owner_uid": updated_preset[1],
        "description": updated_preset[2],
    }


@router.delete("{preset_uid}")
async def delete_preset(
    preset_uid: UUID,
    user_uid: UUID = Depends(authorised_user),
    cur=Depends(DbDriver.db_cursor),
):
    cur.execute(
        "SELECT owner_uid FROM presets WHERE preset_uid = %s;", (str(preset_uid),)
    )
    preset = cur.fetchone()
    if not preset or preset[0] != str(user_uid):
        raise HTTPException(
            status_code=404 if not preset else 401, detail="Not found or Unauthorized"
        )
    sql_delete = "DELETE FROM presets WHERE preset_uid = %s;"
    cur.execute(sql_delete, (str(preset_uid),))
    return {"message": "Preset deleted"}
