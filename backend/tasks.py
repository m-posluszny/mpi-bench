from worker import worker_app


@worker_app.task
def add(x, y):
    return x + y


@worker_app.task
def tsum(*args, **kwargs):
    print(args)
    print(kwargs)
    return sum(args[0])
