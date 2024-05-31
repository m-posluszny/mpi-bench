import { Header, Tile, Tiles } from "../Misc/UI.component"

export const BinaryView = ({ binary, isActive, onDelete, onSelect }) => {
    return (
        <Tile isActive={isActive} onSelect={() => onSelect(binary)}>
            <div>
                <h3>
                    Name
                </h3>
                Name

            </div>
            <h2 className="font-bold">
                {binary?.name}
            </h2>
            <h3 className="font-bold">
                {binary?.branch}
            </h3>
        </Tile>

    )
}
export const BinariesView = (activeUid, onSelect) => {
    const binaries = [
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
            <Header title="Binaries" btnTitle="Upload" btnclassName="bg-orange-500" />
            {
                binaries.map((binary) => <BinaryView key={binary.uid} binary={binary} isActive={binary.uid === activeUid} onSelect={onSelect} />)
            }

        </Tiles >
    )
}

export const CreateBinaryView = () => {
    return <form>

    </form>

}