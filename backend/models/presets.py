from models.base import CustomBaseModel
from uuid import UUID


class Preset(CustomBaseModel):
    preset_id: UUID
    owner_id: UUID
    description: str


class PresetRequest(CustomBaseModel):
    description: str


class PresetUpdate(CustomBaseModel):
    description: str
