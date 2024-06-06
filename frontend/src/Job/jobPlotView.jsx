import { useSelected } from "./jobSelect.hook";
import { PanelClass, ParseDate, Select } from "../Misc/UI.component"
import { useBinaries } from "../ Bin/bin.hook";
import { ScatterChart } from "./Plot";
import { useState } from "react";

export const usePlotData = () => {
    const { selectedList } = useSelected()
    const { getBin } = useBinaries()

    function findCommonStringsInLists(lists) {
        if (lists.length === 0) return [];
        let commonSet = new Set(lists[0]);
        for (let i = 1; i < lists.length; i++) {
            let currentSet = new Set(lists[i]);
            commonSet = new Set([...commonSet].filter(item => currentSet.has(item)));
        }
        return [...commonSet];
    }


    const removeNonCommonObjects = (objects) => {
        let allKeys = [... new Set(Object.values(objects).flatMap(list => list.map(item => Object.keys(item))))];
        const filteredKeys = findCommonStringsInLists(allKeys);
        const out = {}

        Object.entries(objects).forEach(([k, v]) => {
            out[k] = []
            v.forEach((ir) => {
                let or = {}
                Object.entries(ir).forEach(([ik, iv]) => {
                    if (filteredKeys.includes(ik)) {
                        or[ik] = iv
                    }
                })
                out[k].push(or)
            })
        })
        return out
    }

    const runMinNproc = (runs) => {
        if (runs.length === 0) return null
        runs.sort((a, b) => a.n_proc - b.n_proc);
        return runs[0];
    }

    const getFlatRuns = (job) => {
        if (!job) return []
        const minRun = runMinNproc(job.runs)
        return job.runs.map((r) => {
            const p = r.parameters
            const fr = { n_proc: p.n_proc, duration: r.duration }
            p.flags && Object.entries(p.flags).forEach(([k, v]) => {
                fr[k] = v
            })
            r.metrics && Object.entries(r.metrics).forEach(([k, v]) => {
                Object.entries(v).forEach(([sk, v]) => {
                    if (typeof v === 'number') {
                        fr[`${k}_${sk}`] = v
                    }
                })
            })
            if (minRun) {
                fr["acceleration"] = minRun.duration / r.duration
            }
            return fr
        })
    }

    const jobLabel = (job) => {
        const bin = getBin(job.binary_uid)
        return `${ParseDate(job.created)} | ${bin?.name}-${bin?.tag}-${bin?.branch}`
    }

    const prepareDataset = (jobs) => {
        const out = {}
        jobs.forEach((j) => {
            out[jobLabel(j)] = getFlatRuns(j)
        })
        return removeNonCommonObjects(out)
    }

    const dataset = prepareDataset(selectedList)

    const getColumns = (dataset) => {
        const vs = Object.values(dataset)
        console.log(vs)
        if (vs.length === 0) return []
        if (vs[0].length === 0) return []
        return Object.keys(vs[0][0])
    }

    const datasetToPlot = (dataset, x, y) => {

        const datasets = []

        Object.entries(dataset).forEach(([k, v]) => {
            datasets.push({
                label: k,
                data: v.map((r) => {
                    return { x: r[x], y: r[y] }
                }),
                // backgroundColor: 'rgba(75, 192, 192, 0.4)',
                // borderColor: 'rgba(75, 192, 192, 1)',
                showLine: true, // This will draw the line
            })
        })
        return {
            datasets
        }
    }

    return { selectedList, getBin, jobLabel, columns: getColumns(dataset), dataset, datasetToPlot }

}
export const Table = ({ dataset, columns }) => {
    const headerClass = "text-black bg-blue-400  px-5 py-3 border-slate-600"
    const cellClass = "text-black border px-5 py-3 border-slate-600"
    const rowClass = "hover:bg-slate-200"
    return <table className="table-auto bg-white rounded shadow-lg border-collapse">
        <thead>
            <tr>
                <th className={headerClass} key="label">Label</th>
                {columns.map(header => (
                    <th className={headerClass} key={header}>{header}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {Object.entries(dataset).map(([key, rows], index) => (

                rows.map((row, rowIndex) => (
                    <tr className={rowClass} key={index}>
                        <td className={cellClass} key="label">{key}</td>
                        {
                            columns.map(header => (
                                <td className={cellClass} key={header}>{row[header].toFixed(2)}</td>
                            ))
                        }
                    </tr>

                ))


            ))}
        </tbody>
    </table>
}

export const JobPlotView = () => {
    const { dataset, columns, datasetToPlot } = usePlotData()
    console.log("dataset", dataset)
    console.log("columns", columns)
    const [freeX, setFreeX] = useState("duration")
    const [freeY, setFreeY] = useState("n_proc")


    return <div className={PanelClass + " px-10  h-[80vh] overflow-y-auto"}>
        <div className="text-white font-bold my-3">
            Plot View
        </div>
        <hr className="my-4 mt-5" />
        <div className="flex">
            <div className="mx-2">
                <div className="text-white font-bold">
                    Time vs N_Proc
                </div>
                <ScatterChart data={datasetToPlot(dataset, "n_proc", "duration")} x="processes" y="duration" />
            </div>
            <div className="mx-2">
                <div className="text-white font-bold">
                    Threading Acceleration
                </div>
                <ScatterChart data={datasetToPlot(dataset, "n_proc", "acceleration")} x="processes" y="acceleration" />
            </div>
        </div>
        <hr className="my-4 mt-5" />
        <div className="flex">
            <div className="mx-2">
                <div className="text-white font-bold">
                    Free Style Plot
                </div>
                <ScatterChart data={datasetToPlot(dataset, freeX, freeY)} width={700} x={freeX} y={freeY} />
            </div>
            <div className="mx-2">
                <div>
                    Select X Axis
                </div>
                <Select item={freeX} setItem={setFreeX} items={columns} />
                <hr className="my-4 mt-5" />
                <div>
                    Select Y Axis
                </div>
                <Select item={freeY} setItem={setFreeY} items={columns} />
            </div>
        </div>
        <hr className="my-4 mt-5" />
        <div className="text-white font-bold">
            Table
        </div>
        <Table dataset={dataset} columns={columns} />
        <div>
        </div>
    </div>

}