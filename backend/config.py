from pydantic import BaseModel

DATABASE_CONFIG = {
    "user": "your_username",
    "password": "your_password",
    "host": "your_host",
    "port": "your_port",  # Default is 5432
    "database": "your_database",
}

BROKER_URL = "redis://redis:6379/0"
RESULT_BACKEND = "redis://redis:6379/0"


class Settings(BaseModel):
    authjwt_secret_key: str = "secret"
    # Configure application to store and get JWT from cookies
    authjwt_token_location: set = {"cookies"}
    # Disable CSRF Protection for this example. default is True
    authjwt_cookie_csrf_protect: bool = False
