from models.bench import BenchmarkRequest, Benchmark
from backend.db.driver import conn

GET_BENCH_QUERY = "select * from benchmarks where owner_uid = %s;"


def create_benchmark(data: BenchmarkRequest, user_id: int):
    return Benchmark


def update_benchmark(data: Benchmark):
    return Benchmark


def get_benchmarks(user_uid: int):
    cursor = conn.cursor()

    cursor.execute(GET_BENCH_QUERY, (user_uid,))
    benchmarks = cursor.fetchall()
    return []
