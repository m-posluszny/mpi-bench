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
    status,
    duration,
    start_time,
    end_time,
    log_path,
    result_data,
    metrics,
    pj.data as param_json
FROM
    runs as r
    JOIN parameters_json as pj ON r.param_uid = pj.uid;

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
    json_agg (rj.param_json) as runs_json,
    job_status_check (j.uid) AS job_status
FROM
    preset_jobs as j
    JOIN runs_view as rj ON j.uid = rj.binary_uid
GROUP BY
    j.uid