from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Request
import auth.auth as auth
from bin import bin_routes
from runs import runs_routes
from presets import preset_routes
from worker import db
from watchdog import start_watchdog
import sys


def receive_signal(signalNumber, frame):
    sys.exit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    import signal

    signal.signal(signal.SIGINT, receive_signal)
    for cur in db.db_cursor():
        db.load_sql_file(cur, "./db/schemas/schema.sql")
        db.load_sql_file(cur, "./db/schemas/functions.sql")
        db.load_sql_file(cur, "./db/schemas/triggers.sql")
        db.load_sql_file(cur, "./db/schemas/views.sql")
    t = start_watchdog()
    yield
    db.close_connection()
    t.join()


app = FastAPI(lifespan=lifespan, docs_url="/api/docs", redoc_url="/api/redoc")

router = APIRouter(prefix="/api")
router.include_router(auth.router)
router.include_router(bin_routes.router)
router.include_router(runs_routes.router)
router.include_router(preset_routes.router)
app.include_router(router)


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})  # type: ignore
