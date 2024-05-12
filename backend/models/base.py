from pydantic import BaseModel
from pydantic.generics import GenericModel
from typing import Generic, List, TypeVar


class CustomBaseModel(BaseModel):
    @classmethod
    def from_list(cls, tpl):
        return cls(**{k: v for k, v in zip(cls.fields(), tpl)})

    def to_list(self):
        return [getattr(self, f) for f in self.fields()]

    @classmethod
    def fields(cls):
        return list(cls.__fields__.keys())

    @classmethod
    def fields_str(cls):
        return ", ".join(list(cls.__fields__.keys()))

    @classmethod
    def fields_set(cls):
        return ", ".join([f"{f} = %s" for f in list(cls.__fields__.keys())])


Model = TypeVar("Model", bound=BaseModel)


class ManyModel(GenericModel, Generic[Model]):
    items: List[Model]
