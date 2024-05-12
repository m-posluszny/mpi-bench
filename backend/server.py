from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Request
from db.driver import DbDriver
from config import DATABASE_CONFIG
import routes.bin as bin
import routes.auth as auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = DbDriver(**DATABASE_CONFIG)
    # db.load_sql_file("./db/schema.sql")
    # db.load_sql_file("./db/triggers.sql")
    # db.load_sql_file("./db/views.sql")
    yield
    db.close_connection()


app = FastAPI(lifespan=lifespan, docs_url="/api/docs", redoc_url="/api/redoc")

router = APIRouter(prefix="/api")
router.include_router(auth.router)
router.include_router(bin.router)
app.include_router(router)


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})
