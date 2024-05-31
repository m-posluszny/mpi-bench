import { Header, Tile, Tiles } from "../Misc/UI.component"

export const JobView = ({ job, isActive, onDelete, onSelect }) => {
    return (
        <Tile isActive={isActive} onSelect={() => onSelect(job)}>
            <div>
                <h3>
                    Name
                </h3>
                Name

            </div>
            <h2 className="font-bold">
                {job?.name}
            </h2>
            <h3 className="font-bold">
                {job?.branch}
            </h3>
        </Tile >

    )
}
export const JobsView = (activeUid, onSelect) => {
    const jobs = [
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
            <Header title="Jobs" btnTitle={"Compare"} />
            {
                jobs.map((job) => <JobView key={job.uid} job={job} isActive={job.uid === activeUid} onSelect={onSelect} />)
            }

        </Tiles>
    )
}