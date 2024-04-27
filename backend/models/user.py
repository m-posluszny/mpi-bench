import pydantic


class UserInput(pydantic.BaseModel):
    username: str
    password: str
