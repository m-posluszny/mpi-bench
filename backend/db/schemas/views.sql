CREATE
OR REPLACE VIEW bin_view AS
SELECT
    name,
    branch,
    commit_uid,
    tag,
    b.uid as uid,
    b.created as created,
    b.owner_uid as owner_uid,
    count(runs.uid) as runs_count
FROM
    binaries as b
    JOIN runs on runs.binary_uid = b.uid
GROUP BY
    b.uid
ORDER BY
    created DESC;

CREATE
OR REPLACE VIEW parameters_json AS
SELECT
    uid,
    preset_uid,
    json_build_object (
        'uid',
        p.uid,
        'flags',
        p.flags,
        'n_proc',
        p.n_proc
    ) AS data
FROM
    parameters as p;

CREATE
OR REPLACE VIEW runs_view AS
SELECT
    r.uid,
    binary_uid,
    r.created,
    r.owner_uid,
    r.job_uid,
    status,
    duration,
    start_time,
    end_time,
    log_path,
    result_data,
    metrics,
    pj.uid as param_uid,
    pj.data as param_json
FROM
    runs as r
    JOIN parameters_json as pj ON r.param_uid = pj.uid;

CREATE
OR REPLACE VIEW runs_json_view AS
SELECT
    job_uid,
    duration,
    json_build_object (
        'uid',
        uid,
        'binary_uid',
        binary_uid,
        'status',
        status,
        'created',
        created,
        'start_time',
        start_time,
        'end_time',
        end_time,
        'duration',
        duration,
        'metrics',
        metrics,
        'param_json',
        param_json
    ) as data
FROM
    runs_view;

CREATE
OR REPLACE VIEW presets_view AS
SELECT
    p.uid,
    name,
    p.owner_uid,
    description,
    p.created,
    json_agg (pj.data) as params
FROM
    presets as p
    JOIN parameters_json as pj ON p.uid = pj.preset_uid
GROUP BY
    p.uid;

CREATE
OR REPLACE VIEW job_view AS
SELECT
    j.uid,
    j.created,
    j.binary_uid,
    j.preset_uid,
    SUM(duration) as duration,
    json_agg (rj.data) as runs_json,
    job_status_check (j.uid) AS job_status
FROM
    preset_jobs as j
    JOIN runs_json_view as rj ON j.uid = rj.job_uid
GROUP BY
    j.uid