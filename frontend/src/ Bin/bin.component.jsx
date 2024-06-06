import { useState } from "react";
import { Header, Select, Tile, Tiles, Input } from "../Misc/UI.component"
import { useBinaries } from "./bin.hook"
import { FaDeleteLeft } from "react-icons/fa6";

export const BinaryView = ({ binary, isActive, onDelete, onSelect }) => {
    const { refresh } = useBinaries()

    const deleteProcedure = () => window.confirm(`Do you really want to delete ${binary.name}?`) && onDelete(binary.uid).then(() => {
        window.alert("Deleted")
        onSelect(null)
        refresh()
    }).catch(() => alert("Error, cannot delete"))


    return (
        <Tile isActive={isActive} onClick={() => onSelect(binary.uid)}>
            <div className="mx-auto w-full">
                <div className="flex">
                    <h2 className="font-bold">
                        {binary?.name}
                    </h2>
                    <FaDeleteLeft className="ml-auto text-red-500" size={18}
                        onClick={deleteProcedure} />
                </div>
                <div className="text-gray-200">
                    <h2 className="text-gray-100">
                        B[{binary?.branch}] T[{binary?.tag}]
                    </h2>
                    #{binary?.commit_uid}
                </div>
            </div>
        </Tile>
    )
}
export const BinariesView = ({ activeUid, onSelect, onCreate }) => {

    const [branch, setBranch] = useState("")
    const [tag, setTag] = useState("")
    const [name, setName] = useState("")
    const { binaries, deleteBin, branches, tags } = useBinaries(name, tag, branch)

    return (
        <Tiles>
            <Header title="Binaries" btnTitle="Upload" btnClass="bg-orange-700" onClick={onCreate} />
            <div className="bg-gray-500 rounded p-1">
                <div className="w-full mx-1 pe-2">
                    <h3>Name</h3>
                    <Input value={name} setValue={setName} placeholder="Name" />
                </div>
                <div className="flex mb-2">

                    <div className="w-1/2 mx-1">
                        <h3>Branch</h3>
                        <Select setItem={setBranch} items={branches} item={branch} className="w-full" all />
                    </div>
                    <div className="w-1/2 mx-1">
                        <h3>Tag</h3>
                        <Select setItem={setTag} items={tags} item={tag} className="w-full" all />
                    </div>
                </div>
            </div>
            <>
                {
                    binaries.map((binary) => <BinaryView key={binary.uid} binary={binary} isActive={binary.uid === activeUid} onSelect={onSelect} onDelete={deleteBin} />)
                }
            </>

        </Tiles >
    )
}

export const CreateBinaryView = () => {
    return <form>

    </form>

}