import { useSelected } from "./jobSelect.hook";
import { PanelClass, ParseDate } from "../Misc/UI.component"
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

    const jobLabel = (job) => `${ParseDate(job.created)} | ${getBin(job.binary_uid).name} | ${job.status}`

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

export const JobPlotView = () => {
    const { dataset, columns, datasetToPlot } = usePlotData()
    console.log("dataset", dataset)
    console.log("columns", columns)
    const [freeX, setFreeX] = useState("duration")
    const [freeY, setFreeY] = useState("n_proc")

    const cellClass = "p-5"

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
                <select
                    className="text-white rounded p-2 bg-slate-400"
                    value={freeX} // ...force the select's value to match the state variable...
                    onChange={e => setFreeX(e.target.value)} // ... and update the state variable on any change!
                >
                    {columns.map(header => (
                        <option value={header}>{header}</option>
                    ))}
                </select>
                <hr className="my-4 mt-5" />
                <div>
                    Select Y Axis
                </div>
                <select
                    className="text-white rounded p-2 bg-slate-400"
                    value={freeY} // ...force the select's value to match the state variable...
                    onChange={e => setFreeY(e.target.value)} // ... and update the state variable on any change!
                >
                    {columns.map(header => (
                        <option value={header}>{header}</option>
                    ))}
                </select>
            </div>
        </div>
        <hr className="my-4 mt-5" />
        <div className="text-white font-bold">
            Table
        </div>
        <div>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="p-5" key="label">Label</th>
                        {columns.map(header => (
                            <th className="p-5" key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(dataset).map(([key, rows], index) => (

                        rows.map((row, rowIndex) => (
                            <tr className={cellClass} key={index}>
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
        </div>
    </div>

}