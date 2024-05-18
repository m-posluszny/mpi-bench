from models.base import CustomBaseModel
from uuid import UUID


class Preset(CustomBaseModel):
    preset_uid: UUID
    owner_uid: UUID
    description: str


class PresetRequest(CustomBaseModel):
    description: str


class PresetUpdate(CustomBaseModel):
    description: str
