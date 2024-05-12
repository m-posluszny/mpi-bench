import os
import tabulate
import requests as r
from dotenv import load_dotenv
from requests import HTTPError

load_dotenv()
USERNAME = os.getenv("SB_USERNAME")
PASSWORD = os.getenv("SB_PASSWORD")
URL = os.getenv("SB_URL", "http://localhost:8000") + "/api/{}"


def print_table(dataset):
    if not dataset:
        print("No items found")
    header = dataset[0].keys()
    rows = [x.values() for x in dataset]
    print(tabulate.tabulate(rows, header))


def logged_session():
    s = r.Session()
    resp = s.post(
        URL.format("auth/login"), json={"username": USERNAME, "password": PASSWORD}
    )
    raise_for_status(resp)
    return s


def raise_for_status(resp):
    """Raises :class:`HTTPError`, if one occurred."""

    http_error_msg = ""
    reason = resp.text

    if 400 <= resp.status_code < 500:
        http_error_msg = (
            f"{resp.status_code} Client Error: {reason} for url: {resp.url}"
        )

    elif 500 <= resp.status_code < 600:
        http_error_msg = (
            f"{resp.status_code} Server Error: {reason} for url: {resp.url}"
        )

    if http_error_msg:
        raise HTTPError(http_error_msg, response=resp)
