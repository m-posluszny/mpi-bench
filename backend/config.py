from pydantic import BaseModel

BIN_UPLOAD_DIR = "./storage/binaries"
RUN_DIR = "./storage/runs"

DATABASE_CONFIG = {
    "user": "postgres",
    "password": "SETPWDHERE",
    "host": "localhost",
    "port": 5432,
    "dbname": "postgres",
}

BROKER_URL = "redis://redis:6379/0"
RESULT_BACKEND = "redis://redis:6379/0"


class Settings(BaseModel):
    authjwt_secret_key: str = "secret"
    # Configure application to store and get JWT from cookies
    authjwt_token_location: set = {"cookies"}
    # Disable CSRF Protection for this example. default is True
    authjwt_cookie_csrf_protect: bool = False
