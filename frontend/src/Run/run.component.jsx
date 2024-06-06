import { Header, Tile, Tiles } from "../Misc/UI.component"
import { useRuns } from "./run.hook"
import { statusColor, statusAnimate } from "../Misc/consts";

export const RunTile = ({ run, isActive, onDelete, onSelect }) => {
    const date = new Date(run.created)
    const color = statusColor[run.status]
    const animate = statusAnimate[run.status]


    return (
        <Tile isActive={isActive} onClick={onSelect ? () => onSelect(run) : null}>
            <div className="mx-auto w-full">
                <div className="flex">
                    <h2 className="font-bold mr-2">
                        {date.toLocaleString("en-UK")}
                    </h2>
                </div>
                <h2 className={`font-bold bg-${color}-400 px-2 rounded my-1 ${animate}`}>
                    {run?.status}
                </h2>
                <h2 className={`font-bold bg-slate-400 px-2 rounded my-1`}>
                    N_Proc:{" " + run?.parameters.n_proc}
                </h2>
                <h2 className={`font-bold bg-slate-400 px-2 rounded my-1`}>
                    Flags:{" " + Object.keys(run?.parameters.flags).length}
                </h2>
                <h2 className="font-bold bg-slate-400 px-2 rounded">
                    Time{' '}
                    {run?.duration && run?.duration.toFixed(2)} s
                </h2>
            </div>
        </Tile >
    )
}
export const RunsView = ({ juid, activeUid, onSelect, onAdd = () => { } }) => {
    const { runs, deleteRun } = useRuns(juid)
    return (
        <Tiles>
            <Header title="Runs" btnTitle="" btnClass="bg-gray-500" />
            {
                runs.map((run) => <RunTile key={run.uid} run={run} isActive={run.uid === activeUid} onSelect={onSelect} onDelete={deleteRun} onAdd={onAdd} />)
            }

        </Tiles >
    )
}