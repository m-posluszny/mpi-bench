import { Header, Tile, Tiles } from "../Misc/UI.component"
import { useJobs } from "./job.hook"
import { FaDeleteLeft } from "react-icons/fa6";
import { statusColor } from "../Misc/consts";

export const JobView = ({ job, isActive, onDelete, onSelect }) => {
    const { refresh } = useJobs(job.preset_uid, 0)
    const deleteProcedure = () => window.confirm(`Do you really want to delete ${job.name}?`) && onDelete(job.uid).then(() => {
        window.alert("Deleted")
        refresh()
        onSelect(null)
    }).catch((e) => { console.log(e); alert("Error, cannot delete") })

    const date = new Date(job.created)
    const color = statusColor[job.status]

    return (
        <Tile isActive={isActive} onClick={() => onSelect(job)}>
            <div className="mx-auto w-100">
                <div className="flex">
                    <h2 className="font-bold mr-2">
                        {date.toLocaleString("en-UK")}
                    </h2>
                    <FaDeleteLeft className="ml-auto text-red-500" size={18}
                        onClick={deleteProcedure} />
                </div>
                <h2 className={`font-bold bg-${color}-400 px-2 rounded my-1`}>
                    {job?.status}
                </h2>
                <h2 className="font-bold bg-slate-400 px-2 rounded">
                    Time{' '}
                    {job?.duration.toFixed(2)} s
                </h2>
            </div>
        </Tile>
    )
}
export const JobsView = ({ puid, activeUid, onSelect, onCompare = () => { } }) => {
    const { jobs, deleteJob } = useJobs(puid, 500)
    console.log(onSelect)
    return (
        <Tiles>
            <Header title="Jobs" btnTitle="Compare" btnClass="bg-gray-500" onClick={onCompare} />
            {
                jobs.map((job) => <JobView key={job.uid} job={job} isActive={job.uid === activeUid} onSelect={onSelect} onDelete={deleteJob} />)
            }

        </Tiles >
    )
}