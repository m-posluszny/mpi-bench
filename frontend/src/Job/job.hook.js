import { post, remove } from "../Api/core"
import { useCore } from "../Api/core.hook"
import { useAuth } from "../Auth/Auth.hook"

export const URL_JOBS = (puid, uid="") => `/api/presets/${puid}/jobs/${uid}` 

export const useJobs = (puid, interval = 0) => {
    const { authFetcher, withAuth } = useAuth();
    const { data, refresh, loading} = useCore(URL_JOBS(puid),null, true, {refreshInterval: interval}, authFetcher);

    const deleteJob = (uid)=>remove(URL_JOBS(puid, uid))

    const runJob = (binary_uid)=>{
        return withAuth(post, URL_JOBS(puid), {preset_uid:puid, binary_uid})
    } 
    

    return {jobs:data? data.items : [], loading, refresh, deleteJob, runJob}
}