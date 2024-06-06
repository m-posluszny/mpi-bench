import { Tile, Tiles, Header, Input } from "../Misc/UI.component"
import { usePresets } from "./preset.hook"
import { FaDeleteLeft } from "react-icons/fa6";
import { useState } from "react";

export const PresetView = ({ preset, isActive, onDelete, onSelect }) => {

    const { refresh } = usePresets()
    const deleteProcedure = () => window.confirm(`Do you really want to delete ${preset.name}?`) && onDelete(preset.uid).then(() => {
        window.alert("Deleted")
        refresh()
        onSelect(null)
    }).catch((e) => { console.log(e); alert("Error, cannot delete") })


    return (
        <Tile isActive={isActive} onClick={() => onSelect(preset)}>
            <div className="mx-auto w-full">
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
    const [name, setName] = useState("")
    const { presets, deletePreset } = usePresets(name)

    return (
        <Tiles>
            <Header title="Presets" btnTitle="Create" btnClass="bg-lime-500" onClick={onCreate} />
            <div className="mx-1 bg-gray-500 p-1 pb-2 rounded mb-2">
                <h3>Name</h3>
                <Input value={name} setValue={setName} placeholder="Name" />
            </div>
            {
                presets.map((preset) => <PresetView key={preset.uid} preset={preset} isActive={preset.uid === activeUid} onSelect={onSelect} onDelete={deletePreset} />)
            }

        </Tiles >
    )
}