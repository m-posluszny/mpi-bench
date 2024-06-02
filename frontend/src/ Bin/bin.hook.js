import { remove } from "../Api/core"
import { useCore } from "../Api/core.hook"
import { useAuth } from "../Auth/Auth.hook"
import { put, post } from "../Api/core"

export const URL_BINARIES = (uid="") => `/api/binaries/${uid}` 

export const useBinaries = () => {
    const { withAuth, authFetcher } = useAuth();
    const { data, refresh, loading} = useCore(URL_BINARIES(),null, true, {}, authFetcher);

    const deleteBin = (uid)=>remove(URL_BINARIES(uid))

    const createBin = (fileForm, metadata)=>withAuth(post, URL_BINARIES(),
            fileForm
        ).then(
            ({uid})=> withAuth(put, URL_BINARIES(uid),metadata)
        );
    

    return {binaries:data? data.items : [], loading, refresh, deleteBin, createBin}
}