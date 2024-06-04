import { useEffect, useState } from "react";
import { useCore } from "../Api/core.hook"
import { useAuth } from "../Auth/Auth.hook"

export const URL_RUNS = (uid="") => `/api/runs/${uid}` 

export const useRunLog = (uid, _interval=250) =>{
    const {  authFetcher } = useAuth();
    const [interval, setInterval] = useState(_interval);
    const { data:run} = useCore(URL_RUNS(uid),{}, true, {refreshInterval: interval}, authFetcher);
    const { data, refresh, loading} = useCore(URL_RUNS(uid)+"/log",{}, true, {refreshInterval: interval}, authFetcher);

    useEffect(() => {
        if (run?.status === "FINISHED" || run?.status === "FAILED") {
            setInterval(0);
        }
    }, [run])
    return {log:data? data : "", loading, refresh}
}

export const useRuns = (juid, _interval=500) => {
    const {  authFetcher } = useAuth();
    const { data, refresh, loading} = useCore(URL_RUNS(),{job_uid:juid}, true, {refreshInterval: _interval}, authFetcher);


    return {runs:data? data.items : [], loading, refresh}
}