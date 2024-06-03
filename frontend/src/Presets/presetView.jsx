import { FormRow, PanelClass, FormGroup } from "../Misc/UI.component"
import { useBinaries } from "../ Bin/bin.hook"
import { useJobs } from "../Job/job.hook"

export const PresetView = ({ data }) => {

    const { binaries } = useBinaries()
    const { runJob } = useJobs(data.uid)

    const formRunJob = (e) => {
        e.preventDefault()
        runJob(e.target.binary_id.value).then(() => alert("Job Started")).catch(e => {
            console.log(e)
            alert("Error, cannot start job\n" + e?.detail)
        })
    }

    return (
        <div className={PanelClass + " px-10 w-100"}>
            <div className="text-white font-bold my-3">
                Preset View
            </div>
            <FormRow>
                <div>
                    Name:
                </div>
                <div className="mx-2 font-bold">
                    {data.name}
                </div>
            </FormRow>
            {data.description &&
                <FormRow>
                    <div>
                        About:
                    </div>
                    <div className="mx-2">
                        {data.description}
                    </div>
                </FormRow>
            }
            {binaries?.length && <FormGroup bgColor="bg-violet-500">
                <div className="font-bold mx-4">
                    Run Job
                </div>
                <form onSubmit={formRunJob}>
                    <FormRow>
                        <select name="binary_id" className="w-full mx-auto rounded text-black text-center">
                            {binaries.map((b, i) => (
                                <option key={i} value={b.uid}>
                                    {b.name}
                                </option>
                            ))}

                        </select>
                    </FormRow>
                    <FormRow>
                        <button className="text-xs mx-auto bg-slate-300 text-black rounded px-2 py-1">Start</button>
                    </FormRow>

                </form>
            </FormGroup>
            }

            <div>
                Parameters
            </div>
            {data.parameters.map((param, i) => (
                <FormGroup>
                    <div className="font-bold mx-4">
                        Param {i + 1}
                    </div>
                    <div>
                        <FormRow>
                            <div>
                                n_proc:
                            </div>
                            <div className="mx-2">
                                {param.n_proc}
                            </div>

                        </FormRow>

                    </div>
                    <div className="mx-4">
                        Flags
                    </div>
                    {Object.entries(param.flags).map(([k, v]) => (
                        <div>
                            {k} {v}
                        </div>
                    ))}
                </FormGroup>
            ))}
        </div >
    )
}