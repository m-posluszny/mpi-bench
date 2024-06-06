CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE run_status AS ENUM ('PENDING', 'RUNNING', 'FAILED', 'FINISHED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE
    IF NOT EXISTS users (
        uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS binaries (
        uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        owner_uid UUID NOT NULL,
        path TEXT NOT NULL,
        created TIMESTAMP NOT NULL,
        commit_uid TEXT,
        branch TEXT,
        name TEXT,
        tag TEXT,
        FOREIGN KEY (owner_uid) REFERENCES users (uid) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS presets (
        uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        owner_uid UUID NOT NULL,
        name TEXT,
        description TEXT,
        trigger_new BOOLEAN NOT NULL,
        created TIMESTAMP NOT NULL,
        FOREIGN KEY (owner_uid) REFERENCES users (uid)
    );

CREATE TABLE
    IF NOT EXISTS parameters (
        uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        preset_uid UUID,
        flags JSONB NOT NULL,
        n_proc INT NOT NULL,
        FOREIGN KEY (preset_uid) REFERENCES presets (uid) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS preset_jobs (
        uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        preset_uid UUID NOT NULL,
        owner_uid UUID NOT NULL,
        binary_uid UUID NOT NULL,
        created TIMESTAMP NOT NULL,
        FOREIGN KEY (owner_uid) REFERENCES users (uid) ON DELETE CASCADE,
        FOREIGN KEY (preset_uid) REFERENCES presets (uid) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS runs (
        uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        binary_uid UUID NOT NULL,
        owner_uid UUID NOT NULL,
        param_uid UUID NOT NULL,
        job_uid UUID,
        status run_status,
        duration FLOAT,
        created TIMESTAMP,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        log_path TEXT,
        result_data TEXT,
        metrics JSONB,
        FOREIGN KEY (binary_uid) REFERENCES binaries (uid) ON DELETE CASCADE,
        FOREIGN KEY (owner_uid) REFERENCES users (uid) ON DELETE CASCADE,
        FOREIGN KEY (param_uid) REFERENCES parameters (uid) ON DELETE CASCADE,
        FOREIGN KEY (job_uid) REFERENCES preset_jobs (uid) ON DELETE CASCADE
    );

CREATE INDEX IF NOT EXISTS preset_owner_name
ON presets(owner_uid, name);

CREATE INDEX IF NOT EXISTS bin_params
ON binaries(owner_uid, name, branch, tag);

CREATE INDEX IF NOT EXISTS run_fk_binary
ON runs(binary_uid);

CREATE INDEX IF NOT EXISTS run_fk_job
ON runs(job_uid);

CREATE INDEX IF NOT EXISTS parameter_fk_preset
ON parameters(preset_uid);

CREATE INDEX IF NOT EXISTS preset_owner
ON presets(owner_uid);