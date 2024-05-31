import { Tile, Tiles, Header } from "../Misc/UI.component"

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
export const PresetsView = (activeUid, onSelect) => {
    const presets = [
        {
            uid: "1234567890",
            name: "test",
            branch: "main",
            created: "2022-01-01",
            tag: "v1.0.0",
            commit_uid: "1234567890"
        },
        {
            uid: "1234567890",
            name: "test",
            branch: "main",
            created: "2022-01-01",
            tag: "v1.0.0",
            commit_uid: "1234567890"
        },
        {
            uid: "1234567890",
            name: "test",
            branch: "main",
            created: "2022-01-01",
            tag: "v1.0.0",
            commit_uid: "1234567890"
        },
    ]



    return (
        <Tiles>
            <Header title="Presets" btnTitle="Create" btnclassName="bg-lime-500" />
            {
                presets.map((preset) => <PresetView key={preset.uid} preset={preset} isActive={preset.uid === activeUid} onSelect={onSelect} />)
            }

        </Tiles >
    )
}