import { BinaryCreateView } from "../ Bin/binCreate.component"
import { MultiViewEnum } from "../Misc/consts"
import { PresetCreateView } from "../Presets/presetCreate.component"
import { PresetView } from "../Presets/presetView"

export const MultiPanel = ({ view, data }) => {
    switch (view) {
        case MultiViewEnum.BINARY_CREATE:
            return <BinaryCreateView />
        case MultiViewEnum.PRESET_CREATE:
            return <PresetCreateView />
        case MultiViewEnum.PRESET_VIEW:
            return <PresetView data={data} />
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