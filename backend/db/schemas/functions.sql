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

CREATE OR REPLACE FUNCTION job_status_check(job_uid UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN 
    RETURN (SELECT status FROM runs WHERE runs.job_uid = job_uid
    order by case "status"
            when 'FAILED' then 1
            when 'PENDING' then 2
            when 'RUNNING' then 3
            when 'COMPLETE' then 4
         end, 
         updated_at desc LIMIT 1

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
    PERFORM pg_notify('delete_bin', NEW.OLD::text);
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
    INSERT INTO runs (binary_uid, owner_uid, param_uid, status)
    VALUES (bin_uid, owner_uid, param_uid, 'PENDING')
    RETURNING uid INTO run_uid;
END;
$$;


CREATE OR REPLACE PROCEDURE begin_job(
    IN preset_uid UUID, 
    IN bin_uid UUID,
    OUT job_uid UUID)
LANGUAGE plpgsql
AS $$
DECLARE
    param RECORD;
    owner_uid UUID;
BEGIN
    BEGIN
        INSERT INTO jobs (preset_uid, binary_uid) VALUES (preset_uid, bin_uid) RETURNING uid INTO job_uid;

        SELECT owner_uid INTO owner_uid FROM presets WHERE uid = preset_uid;

        FOR param IN 
            SELECT uid FROM parameters as p
            WHERE p.preset_uid = preset_uid
        LOOP
            CALL create_run(bin_uid, owner_uid, param.parameter_uid, job_uid);
        END LOOP;
        
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END;
END;
$$;
