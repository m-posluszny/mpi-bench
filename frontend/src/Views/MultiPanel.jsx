import { BinaryCreateView } from "../ Bin/binCreate.component"
import { MultiViewEnum } from "../Misc/consts"
import { PresetCreateView } from "../Presets/presetCreate.component"
import { PresetView } from "../Presets/presetView"
import { RunView } from "../Run/runView"

export const MultiPanel = ({ view, data }) => {
    switch (view) {
        case MultiViewEnum.BINARY_CREATE:
            return <BinaryCreateView />
        case MultiViewEnum.PRESET_CREATE:
            return <PresetCreateView />
        case MultiViewEnum.PRESET_VIEW:
            return <PresetView data={data} />
        case MultiViewEnum.RUN_VIEW:
            return <RunView data={data} />
        case MultiViewEnum.JOB_COMPARE:
            return <div>Job compar</div>
        default:
            return <div></div>
    }

}