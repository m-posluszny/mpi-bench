CREATE OR REPLACE FUNCTION set_created_function() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.created := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION set_start_time_function()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.start_time := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_time_on_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.status = 'RUNNING' AND OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.start_time := CURRENT_TIMESTAMP;
    END IF;
    IF (NEW.status = 'FINISHED' OR NEW.status = 'FAILED') AND OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.end_time := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION job_status_check(i_job_uid UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN 
    RETURN (SELECT status FROM runs as r WHERE r.job_uid = i_job_uid
    order by case "status"
            when 'FAILED' then 1
            when 'PENDING' then 2
            when 'RUNNING' then 3
            when 'FINISHED' then 4
         end, 
         created desc LIMIT 1

    );
END;
$$;

CREATE OR REPLACE FUNCTION notify_new_run()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM pg_notify('new_run', NEW.uid::text);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION notify_delete_bin()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM pg_notify('delete_bin', OLD.path::text);
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION notify_delete_run()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM pg_notify('delete_run', OLD.uid::text);
    RETURN OLD;
END;
$$;


CREATE OR REPLACE PROCEDURE create_run(
    IN bin_uid UUID, 
    IN owner_uid UUID, 
    IN param_uid UUID, 
    IN job_uid UUID,
    OUT run_uid UUID)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO runs (binary_uid, owner_uid, job_uid, param_uid ,status)
    VALUES (bin_uid, owner_uid, job_uid, param_uid, 'PENDING')
    RETURNING uid INTO run_uid;
END;
$$;


CREATE OR REPLACE PROCEDURE begin_job(
    IN i_preset_uid UUID, 
    IN i_bin_uid UUID,
    OUT job_uid UUID)
LANGUAGE plpgsql
AS $$
DECLARE
    param RECORD;
    i_owner_uid UUID;
    buff UUID;
BEGIN
        SELECT p.owner_uid INTO i_owner_uid FROM presets as p WHERE p.uid = i_preset_uid;

        INSERT INTO preset_jobs (preset_uid, binary_uid, owner_uid) VALUES (i_preset_uid, i_bin_uid, i_owner_uid) RETURNING uid INTO job_uid;

        FOR param IN 
            SELECT uid FROM parameters as p
            WHERE p.preset_uid = i_preset_uid
        LOOP
            CALL create_run(i_bin_uid, i_owner_uid, param.uid, job_uid, buff);
        END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION trigger_new_bin() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    param RECORD;
    buff UUID;
BEGIN
    FOR param IN
        SELECT
            uid
        FROM
            presets
        WHERE
            trigger_new = TRUE
    LOOP
        CALL begin_job(param.uid, NEW.uid, buff);
    END LOOP;
    RETURN NEW;
END;
$$;