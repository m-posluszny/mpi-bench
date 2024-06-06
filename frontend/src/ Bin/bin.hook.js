import { remove } from "../Api/core"
import { useCore } from "../Api/core.hook"
import { useAuth } from "../Auth/Auth.hook"
import { put, post } from "../Api/core"

export const URL_BINARIES = (uid="", name="", tag="", branch="") => `/api/binaries/${uid}?name=${name}&tag=${tag}&branch=${branch}` 

export const URL_MISC = (type="") => `/api/misc/${type}`

export const useBinaries = (name="", tag="", branch="") => {
    const { withAuth, authFetcher } = useAuth();
    const { data, refresh:refreshBin, loading} = useCore(URL_BINARIES("", name,tag,branch),null, true, {}, authFetcher);

    const { data:branchData, refresh:refreshBranches} = useCore(URL_MISC("branches"));
    const { data:tagData, refresh:refreshTags} = useCore(URL_MISC("tags"));

    const refresh = () => {
        refreshBin();
        refreshBranches();
        refreshTags();
    }

    const getBin = (uid) => data.items.find((bin) => bin.uid === uid)

    const deleteBin = (uid)=>remove(URL_BINARIES(uid)).finally(refresh)

    const createBin = (fileForm, metadata)=>withAuth(post, URL_BINARIES(),
            fileForm
        ).then(
            ({uid})=> withAuth(put, URL_BINARIES(uid),metadata)
        );
    

    return {binaries:data? data.items : [], loading, refresh, deleteBin, createBin, getBin, branches:branchData? branchData.items : [], tags:tagData? tagData.items : [], tagData}
}