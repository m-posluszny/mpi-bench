
-- Triggers for binaries and users table
DO
$$BEGIN
CREATE TRIGGER bin_created_trigger
BEFORE INSERT ON binaries
FOR EACH ROW EXECUTE PROCEDURE set_created_function();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

-- Triggers for binaries to run presets that should be triggered on new run
DO
$$BEGIN
CREATE TRIGGER bin_trigger_preset
AFTER INSERT ON binaries
FOR EACH ROW EXECUTE PROCEDURE trigger_new_bin();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

DO
$$BEGIN
CREATE TRIGGER preset_created_trigger
BEFORE INSERT ON presets
FOR EACH ROW EXECUTE PROCEDURE set_created_function();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

DO
$$BEGIN
CREATE TRIGGER preset_jobs_created_trigger
BEFORE INSERT ON preset_jobs
FOR EACH ROW EXECUTE PROCEDURE set_created_function();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

-- Trigger for runs table
DO
$$BEGIN
CREATE TRIGGER run_create_trigger
BEFORE INSERT ON runs
FOR EACH ROW EXECUTE PROCEDURE set_created_function();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

-- Trigger to handle run time updates on status change
DO
$$BEGIN
CREATE TRIGGER update_time_trigger
AFTER UPDATE OF status ON runs
FOR EACH ROW
EXECUTE PROCEDURE update_time_on_status_change();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

-- Triggers for new run notification
DO
$$BEGIN
CREATE TRIGGER new_run_notify_trigger
AFTER INSERT ON runs
FOR EACH ROW EXECUTE PROCEDURE notify_new_run();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

DO
$$BEGIN
CREATE TRIGGER preset_created_trigger
BEFORE INSERT ON presets
FOR EACH ROW EXECUTE PROCEDURE set_created_function();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

DO
$$BEGIN
CREATE TRIGGER preset_created_trigger
BEFORE INSERT ON preset_jobs
FOR EACH ROW EXECUTE PROCEDURE set_created_function();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

-- Trigger to handle run time updates on status change
DO
$$BEGIN
CREATE TRIGGER update_time_trigger
AFTER UPDATE OF status ON runs
FOR EACH ROW
EXECUTE PROCEDURE update_time_on_status_change();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

-- Trigger to handle run time updates on status change
DO
$$BEGIN
CREATE TRIGGER delete_bin_trigger
BEFORE DELETE ON binaries
FOR EACH ROW
EXECUTE PROCEDURE notify_delete_bin();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;

DO
$$BEGIN
CREATE TRIGGER delete_run_trigger
BEFORE DELETE ON runs
FOR EACH ROW
EXECUTE PROCEDURE notify_delete_run();
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END;$$;