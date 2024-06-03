import { remove } from "../Api/core"
import { useCore } from "../Api/core.hook"
import { useAuth } from "../Auth/Auth.hook"
import { post } from "../Api/core"

export const URL_PRESETS = (uid="") => `/api/presets/${uid}` 

export const usePresets = () => {
    const { withAuth, authFetcher } = useAuth();
    const { data, refresh, loading} = useCore(URL_PRESETS(),null, true, {}, authFetcher);

    const deletePreset = (uid)=>remove(URL_PRESETS(uid))

    const createPreset = (metadata)=>{
        return withAuth(post, URL_PRESETS(), metadata)
    } 
    

    return {presets:data? data.items : [], loading, refresh, deletePreset, createPreset}
}