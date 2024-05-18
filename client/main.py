import typer
import requests as r
from libs import USERNAME, PASSWORD, raise_for_status, URL
from bin import app as bin_app

app = typer.Typer()
app.add_typer(bin_app, name="bin")


@app.command()
def register():
    resp = r.post(
        URL.format("auth/register"), json={"username": USERNAME, "password": PASSWORD}
    )

    raise_for_status(resp)
    print(f"Registered successfully {USERNAME}")


if __name__ == "__main__":
    app()
