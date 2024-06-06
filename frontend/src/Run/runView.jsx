import { FormRow, PanelClass, FormGroup } from "../Misc/UI.component"
import { useBinaries } from "../ Bin/bin.hook"
import { useRuns, useRunLog } from "./run.hook"
import { RunTile } from "./run.component"


export const RunView = ({ data }) => {

    const log = useRunLog(data.uid)
    const flags = data?.parameters?.flags
    const metrics = data?.metrics

    return <div className={PanelClass + " px-10 flex h-[80vh] overflow-y-auto"}>
        <div className="w-50 h-100">
            <div className="text-white font-bold my-3">
                Run View
            </div>
            <RunTile run={data} />
            {flags && flags.length !== 0 &&
                <>
                    <hr className="my-4 mt-5" />
                    <div className="text-white font-bold">
                        Flags
                    </div>
                    {
                        Object.entries(flags).map(([k, v]) => (
                            <h3 className="ml-5">
                                {k}{' '}{v}
                            </h3>
                        ))
                    }
                </>
            }
            {metrics &&
                <>
                    <hr className="my-4 mt-5" />
                    <div className="text-white font-bold">
                        Metrics
                    </div>
                    {
                        Object.entries(metrics).map(([k, v]) => (
                            <div className="ml-5 my-2 rounded bg-slate-700">
                                <h3 className="ml-3">
                                    {k}{'.json '}
                                </h3>
                                <div className="ml-6">
                                    {
                                        Object.entries(v).map(([k, v]) => (
                                            <h3 className="ml-5">
                                                {k}{' '}{v}
                                            </h3>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </>
            }
        </div>
        <div className="ms-3 w-50">
            <div className="text-white font-bold my-3">
                Logs
            </div>
            {log.log && <textarea readOnly className="w-full h-100 text-white bg-slate-700 rounded-xl  h-5/6 w-[35vh] mb-5" value={log.log}>
            </textarea>}
        </div>
    </div >

}