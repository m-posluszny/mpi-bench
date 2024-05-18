from fastapi import HTTPException
from pydantic import BaseModel
from pydantic.generics import GenericModel
from typing import Generic, List, TypeVar


class CustomBaseModel(BaseModel):
    __table = None

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

    @classmethod
    def _from_row(cls, row):
        raise NotImplementedError

    @classmethod
    def row_factory(cls, cursor):
        columns = [column.name for column in cursor.description]

        def make_row(values):
            row = dict(zip(columns, values))
            return cls._from_row(row)

        return make_row

    @classmethod
    def convert_one(cls, cursor):
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(404, "Not found")
        return cls.row_factory(cursor)(row)

    @classmethod
    def convert_many(cls, cursor):
        row = cursor.fetchall()
        return cls.row_factory(cursor)(row)


Model = TypeVar("Model", bound=BaseModel)


class ManyModel(GenericModel, Generic[Model]):
    items: List[Model]
