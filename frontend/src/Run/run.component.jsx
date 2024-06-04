import { Header, Tile, Tiles } from "../Misc/UI.component"
import { useRuns } from "./run.hook"
import { FaDeleteLeft } from "react-icons/fa6";
import { statusColor } from "../Misc/consts";

export const RunTile = ({ run, isActive, onDelete, onSelect }) => {
    const { refresh } = useRuns(run.preset_uid, 0)
    const deleteProcedure = () => window.confirm(`Do you really want to delete ${run.name}?`) && onDelete(run.uid).then(() => {
        window.alert("Deleted")
        refresh()
        onSelect(null)
    }).catch((e) => { console.log(e); alert("Error, cannot delete") })

    const date = new Date(run.created)
    const color = statusColor[run.status]
    console.log(run, color)

    return (
        <Tile isActive={isActive} onClick={onSelect ? () => onSelect(run) : null}>
            <div className="mx-auto w-100">
                <div className="flex">
                    <h2 className="font-bold mr-2">
                        {date.toLocaleString("en-UK")}
                    </h2>
                    {onDelete &&
                        <FaDeleteLeft className="ml-auto text-red-500" size={18}
                            onClick={deleteProcedure} />
                    }
                </div>
                <h2 className={`font-bold bg-${color}-400 px-2 rounded my-1`}>
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
        </Tile>
    )
}
export const RunsView = ({ juid, activeUid, onSelect, onCompare = () => { } }) => {
    const { runs, deleteRun } = useRuns(juid)
    console.log(onSelect)
    return (
        <Tiles>
            <Header title="Runs" btnTitle="Compare" btnClass="bg-gray-500" onClick={onCompare} />
            {
                runs.map((run) => <RunTile key={run.uid} run={run} isActive={run.uid === activeUid} onSelect={onSelect} onDelete={deleteRun} />)
            }

        </Tiles >
    )
}