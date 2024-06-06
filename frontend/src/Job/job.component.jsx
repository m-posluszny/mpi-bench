import { Header, ParseDate, Tile, Tiles } from "../Misc/UI.component"
import { useJobs } from "./job.hook"
import { FaDeleteLeft, FaSquarePlus, FaSquareMinus } from "react-icons/fa6";
import { statusColor } from "../Misc/consts";
import { useSelected } from "./jobSelect.hook";

export const JobView = ({ job, isActive, onDelete, onSelect, isHighlighted }) => {
    const { refresh } = useJobs(job.preset_uid, 0)
    const deleteProcedure = () => window.confirm(`Do you really want to delete ${job.name}?`) && onDelete(job.uid).then(() => {
        window.alert("Deleted")
        refresh()
        onSelect(null)
    }).catch((e) => { console.log(e); alert("Error, cannot delete") })

    const { addObject, jobInList } = useSelected()

    const addClick = (e) => { e.stopPropagation(); addObject(job) }
    const color = statusColor[job.status]
    const highlightClass = isHighlighted ? "bg-purple-700" : ""

    return (
        <Tile className={highlightClass} isActive={isActive} onClick={() => onSelect(job)}>
            <div className="mx-auto w-full">
                <div className="flex">
                    <h2 className="font-bold mr-2">
                        {ParseDate(job.created)}
                    </h2>
                    <FaDeleteLeft className="ml-auto text-red-500 mr-1 pt-0 " size={19}
                        onClick={deleteProcedure} />
                    <>
                        {
                            jobInList(job) ? <FaSquareMinus className="ml-auto text-red-500 hover:text-red-300" size={18} onClick={addClick} /> :
                                <FaSquarePlus className="ml-auto text-green-500 hover:text-green-300" size={18}
                                    onClick={addClick} />
                        }
                    </>
                </div>
                <h2 className={`font-bold bg-${color}-400 px-2 rounded my-1`}>
                    {job?.status}
                </h2>
                <h2 className="font-bold bg-slate-400 px-2 rounded">
                    Time{' '}
                    {job?.duration && job.duration.toFixed(2)} s
                </h2>
            </div>
        </Tile>
    )
}
export const JobsView = ({ puid, activeUid, onSelect, onPlot = () => { }, activeBinaryUid }) => {
    const { jobs, deleteJob } = useJobs(puid, 500)
    console.log(activeBinaryUid, jobs.map(job => job.binary_uid))
    return (
        <Tiles>
            <Header title="Jobs" btnTitle="Plot" btnClass="bg-gray-500" onClick={onPlot} />
            {
                jobs.map((job) => <JobView key={job.uid} job={job} isActive={job.uid === activeUid} onSelect={onSelect} onDelete={deleteJob} isHighlighted={job.binary_uid === activeBinaryUid} />)
            }

        </Tiles >
    )
}