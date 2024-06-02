import { BinaryCreateView } from "../ Bin/binCreate.component"
import { MultiViewEnum } from "../Misc/consts"

export const MultiPanel = ({ view, data }) => {
    console.log(view)
    switch (view) {
        case MultiViewEnum.BINARY_CREATE:
            return <BinaryCreateView />
        case MultiViewEnum.PRESET_CREATE:
            return <BinaryCreateView />
        case MultiViewEnum.PRESET_VIEW:
            return <div>Preset view</div>
        case MultiViewEnum.JOB_VIEW:
            return <div>Job view</div>
        case MultiViewEnum.RUN_VIEW:
            return <div>Run view</div>
        case MultiViewEnum.JOB_COMPARE:
            return <div>Job compar</div>
        default:
            return <div></div>
    }

}