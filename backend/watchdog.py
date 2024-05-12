def watch_for_triggers(): ...


def binaries_cleanup(): ...


def main():
    watch_for_triggers()
    binaries_cleanup()


if __name__ == "__main__":
    while True:
        main()
