import { Header, Tile, Tiles } from "../Misc/UI.component"
import { useBinaries } from "./bin.hook"
import { FaDeleteLeft } from "react-icons/fa6";

export const BinaryView = ({ binary, isActive, onDelete, onSelect }) => {

    const deleteProcedure = () => window.confirm(`Do you really want to delete ${binary.name}?`) && onDelete(binary.uid).then(() => {
        window.alert("Deleted")
        onSelect(null)
    }).catch(() => alert("Error, cannot delete"))


    return (
        <Tile isActive={isActive} onClick={() => onSelect(binary.uid)}>
            <div>
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

    const { binaries, deleteBin } = useBinaries()

    return (
        <Tiles>
            <Header title="Binaries" btnTitle="Upload" btnClass="bg-orange-700" onClick={onCreate} />
            {
                binaries.map((binary) => <BinaryView key={binary.uid} binary={binary} isActive={binary.uid === activeUid} onSelect={onSelect} onDelete={deleteBin} />)
            }

        </Tiles >
    )
}

export const CreateBinaryView = () => {
    return <form>

    </form>

}