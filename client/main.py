import typer
import requests as r
from pygit2 import Repository
from libs import print_table, USERNAME, PASSWORD, raise_for_status, URL, logged_session

app = typer.Typer()


@app.command()
def register():
    resp = r.post(
        URL.format("auth/register"), json={"username": USERNAME, "password": PASSWORD}
    )

    raise_for_status(resp)
    print(f"Registered successfully {USERNAME}")


@app.command()
def send(
    filepath: str,
    name: str,
    tag: str,
):

    s = logged_session()
    repo = Repository(".")
    branch = repo.head.shorthand
    commit = repo[repo.head.target].hex

    print(f"Uploading file: {filepath} as {name}, tag:{tag}")
    print(f"Branch: {branch}, commit: {commit}")
    resp = s.post(URL.format("binaries"), files={"file": open(filepath, "r")})
    uid = resp.json()["uid"]
    raise_for_status(resp)

    resp = s.put(
        URL.format(f"binaries/{uid}"),
        json={"tag": tag, "name": name, "branch": branch, "commit_id": commit},
    )

    raise_for_status(resp)


@app.command()
def list_bins():
    s = logged_session()
    resp = s.get(URL.format("binaries"))
    raise_for_status(resp)
    print_table(resp.json().get("items", []))


@app.command()
def create_preset(): ...


if __name__ == "__main__":
    app()
