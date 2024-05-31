import { Header, Tile, Tiles } from "../Misc/UI.component"

export const RunView = ({ run, isActive, onDelete, onSelect }) => {
    return (
        <Tile isActive={isActive} onSelect={() => onSelect(run)}>
            <div>
                <h3>
                    Name
                </h3>
                Name

            </div>
            <h2 className="font-bold">
                {run?.name}
            </h2>
            <h3 className="font-bold">
                {run?.branch}
            </h3>
        </Tile >

    )
}
export const RunsView = (activeUid, onSelect) => {
    const runs = [
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
            <Header title="Runs" />
            {
                runs.map((data) => <RunView key={data.uid} run={data} isActive={data.uid === activeUid} onSelect={onSelect} />)
            }

        </Tiles>
    )
}