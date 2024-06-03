import { remove } from "../Api/core"
import { useCore } from "../Api/core.hook"
import { useAuth } from "../Auth/Auth.hook"
import { post } from "../Api/core"

export const URL_JOBS = (puid, uid="") => `/api/presets/${puid}/jobs` 

export const useJobs = (puid) => {
    const { withAuth, authFetcher } = useAuth();
    const { data, refresh, loading} = useCore(URL_JOBS(puid),null, true, {}, authFetcher);

    const deletePreset = (uid)=>remove(URL_JOBS(puid, uid))

    const runJob = (binary_uid)=>{
        return withAuth(post, URL_JOBS(puid), {preset_uid:puid, binary_uid})
    } 
    

    return {jobs:data? data.items : [], loading, refresh, deletePreset, runJob}
}