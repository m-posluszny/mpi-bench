import { Tile, Tiles, Header } from "../Misc/UI.component"
import { usePresets } from "./preset.hook"

export const PresetView = ({ preset, isActive, onDelete, onSelect }) => {
    return (
        <Tile isActive={isActive} onSelect={() => onSelect(preset)}>
            <div>
                <h3>
                    Name
                </h3>
                Name

            </div>
            <h2 className="font-bold">
                {preset?.name}
            </h2>
            <h3 className="font-bold">
                {preset?.branch}
            </h3>
        </Tile >

    )
}
export const PresetsView = ({ activeUid, onSelect, onCreate = () => { } }) => {
    const { presets } = usePresets()

    return (
        <Tiles>
            <Header title="Presets" btnTitle="Create" btnClass="bg-lime-500" onClick={onCreate} />
            {
                presets.map((preset) => <PresetView key={preset.uid} preset={preset} isActive={preset.uid === activeUid} onSelect={onSelect} />)
            }

        </Tiles >
    )
}