import { Header, Tile, Tiles } from "../Misc/UI.component"
import { useJobs } from "./job.hook"
import { FaDeleteLeft } from "react-icons/fa6";

export const JobView = ({ puid, job, isActive, onDelete, onSelect }) => {
    const { refresh } = useJobs(puid)
    const deleteProcedure = () => window.confirm(`Do you really want to delete ${job.name}?`) && onDelete(job.uid).then(() => {
        window.alert("Deleted")
        refresh()
        onSelect(null)
    }).catch((e) => { console.log(e); alert("Error, cannot delete") })

    return (
        <Tile isActive={isActive} onClick={() => onSelect(job)}>
            <div className="mx-auto w-100">
                <div className="flex">
                    <h2 className="font-bold">
                        {job?.created}
                    </h2>
                    <h2 className="font-bold">
                        #{job?.uid}
                    </h2>
                    <FaDeleteLeft className="ml-auto text-red-500" size={18}
                        onClick={deleteProcedure} />
                </div>
            </div>
        </Tile>
    )
}
export const JobsView = ({ puid, activeUid, onSelect, onCompare = () => { } }) => {
    const { jobs, deleteJob } = useJobs(puid)

    return (
        <Tiles>
            <Header title="Jobs" btnTitle="Create" btnClass="bg-gray-500" onClick={onCompare} />
            {
                jobs.map((job) => <JobView key={job.uid} job={job} isActive={job.uid === activeUid} onSelect={onSelect} onDelete={deleteJob} />)
            }

        </Tiles >
    )
}