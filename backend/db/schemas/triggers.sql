-- Functions and triggers for automatic setting of UIDs and timestamps
CREATE OR REPLACE FUNCTION set_uid_function() 
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.uid := uuid_generate_v4();
    RETURN NEW;
END;
$$;

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
    IF NEW.status = 'running' AND OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.start_time := CURRENT_TIMESTAMP;
    END IF;
    IF (NEW.status = 'complete' OR NEW.status = 'error') AND OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.end_time := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

-- Triggers for binaries and users table
DO
$$BEGIN
CREATE TRIGGER bin_created_trigger
BEFORE INSERT ON binaries
FOR EACH ROW EXECUTE PROCEDURE set_created_function();
CREATE TRIGGER user_uid_trigger
BEFORE INSERT ON users
FOR EACH ROW EXECUTE PROCEDURE set_uid_function();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

-- Trigger for runs table
CREATE TRIGGER run_start_trigger
BEFORE INSERT ON runs
FOR EACH ROW EXECUTE PROCEDURE set_start_time_function();

-- Trigger to handle run time updates on status change
CREATE TRIGGER update_time_trigger
AFTER UPDATE OF status ON runs
FOR EACH ROW
EXECUTE PROCEDURE update_time_on_status_change();