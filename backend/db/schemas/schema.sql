CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for run status
CREATE TYPE run_status AS ENUM ('queued', 'running', 'complete', 'error');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

-- Binaries table
CREATE TABLE IF NOT EXISTS binaries (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_uid UUID NOT NULL,
    path TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    commit_id TEXT,
    branch TEXT,
    name TEXT,
    tag TEXT,
    FOREIGN KEY (owner_uid) REFERENCES users(uid)
);

-- Runs table
CREATE TABLE IF NOT EXISTS runs (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    binary_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    param_id UUID NOT NULL,
    status run_status,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    log_path TEXT,
    result_data TEXT,
    FOREIGN KEY (binary_id) REFERENCES binaries(uid),
    FOREIGN KEY (owner_id) REFERENCES users(uid),
    FOREIGN KEY (param_id) REFERENCES users(uid)
);

-- Presets table
CREATE TABLE IF NOT EXISTS presets (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    name TEXT,
    description TEXT,
    FOREIGN KEY (owner_id) REFERENCES users(uid)
);

-- Parameters table now general for both runs and presets
CREATE TABLE IF NOT EXISTS parameters (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL, -- This can be either a preset_id or run_id
    parameters JSON, -- Change to JSONB if needed
);

-- Linking table for presets and runs
CREATE TABLE IF NOT EXISTS preset_runs (
    preset_id UUID NOT NULL,
    run_id UUID NOT NULL,
    PRIMARY KEY (preset_id, run_id),
    FOREIGN KEY (preset_id) REFERENCES presets(preset_id),
    FOREIGN KEY (run_id) REFERENCES runs(run_id)
);
