import { Tile, Tiles, Header } from "../Misc/UI.component"
import { usePresets } from "./preset.hook"
import { FaDeleteLeft } from "react-icons/fa6";

export const PresetView = ({ preset, isActive, onDelete, onSelect }) => {

    const { refresh } = usePresets()
    const deleteProcedure = () => window.confirm(`Do you really want to delete ${preset.name}?`) && onDelete(preset.uid).then(() => {
        window.alert("Deleted")
        refresh()
        onSelect(null)
    }).catch((e) => { console.log(e); alert("Error, cannot delete") })


    return (
        <Tile isActive={isActive} onClick={() => onSelect(preset)}>
            <div className="mx-auto w-100">
                <div className="flex">
                    <h2 className="font-bold">
                        {preset?.name}
                    </h2>
                    <FaDeleteLeft className="ml-auto text-red-500" size={18}
                        onClick={deleteProcedure} />
                </div>
                <div className="text-gray-200">
                    {preset?.description}
                </div>
            </div>
        </Tile>
    )
}
export const PresetsView = ({ activeUid, onSelect, onCreate = () => { } }) => {
    const { presets, deletePreset } = usePresets()

    return (
        <Tiles>
            <Header title="Presets" btnTitle="Create" btnClass="bg-lime-500" onClick={onCreate} />
            {
                presets.map((preset) => <PresetView key={preset.uid} preset={preset} isActive={preset.uid === activeUid} onSelect={onSelect} onDelete={deletePreset} />)
            }

        </Tiles >
    )
}