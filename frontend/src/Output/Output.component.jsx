import { OutputColor, OutputIcon, OutputSuccess, OutputLoading, OutputError } from "./Output.type";
import { Circle } from "../Misc/Circle.component";
import { ExpandButton } from "../Misc/Buttons.component";
import { useState } from "react";
import {
    useResults, useResult
} from "./Output.hook";

export const OutputTile = ({ type, message }) => <>
    <div className={`flex w-full my-5 p-3 rounded-xl ${OutputColor(type)}  ${type === OutputLoading && "animate-pulse"}`}>
        <OutputIcon type={type} />
        <p className='text-xl  my-auto ms-5'>
            {message}
        </p>
    </div>
</>

export const PassHeader = ({ index, date, loading, type }) => {
    let d = new Date(date)
    return <div className={`bg-opacity-70 bg-white rounded-2xl p-2 text-md flex w-fit me-auto`}>
        <Circle className={OutputColor(type)}> {index} </Circle>
        <div className={`py-1 mx-3 text-center ${loading && "animate-pulse"}`}>
            {d.toLocaleString().replace(",", " |")}
        </div>
    </div>

}

export const MetaHeader = ({ meta }) => {
    return meta?.passwordLen ? <>
        <div className="ms-auto me-5 text-right bg-opacity-70 bg-white rounded-2xl p-2 text-md flex w-fit">
            <div className="py-1 mx-3 text-center">
                {Array(meta.passwordLen).fill(0).map((_, i) => "*")}
            </div>
        </div>

    </> : <></>
}


export const OutputSubList = ({ index, id, expanded }) => {
    const [isExpanded, setExpanded] = useState(expanded)
    console.log(id)
    const { output, state, error } = useResult(id)
    if (error || !output) {
        return <></>
    }
    const loading = output.isProcessing
    console.log(output, state, loading)

    return <div className="bg-opacity-20 bg-white rounded-2xl p-3 text-xl mb-3" >
        <div className="flex">
            <PassHeader date={output.date} index={index} loading={loading} type={state} />
            <MetaHeader meta={output.meta} />
            <ExpandButton className=" bg-white bg-opacity-70 rounded-xl" isExpanded={isExpanded} setExpanded={setExpanded} />
        </div>
        <div className={`${isExpanded ? 'h-full' : 'h-0'
            } transition-[height]  duration-100 overflow-hidden w-full`}>
            {output.strength > -1 ?
                <OutputTile type={OutputSuccess} message={`Password strength: ${output.strength}`} /> :
                loading ?
                    < OutputTile type={OutputLoading} message="Password strength check in progress..." /> : < OutputTile type={OutputError} message="Couldn't evaluate password strength" />
            }
            {output?.preconditions?.map((precondition) =>
                <OutputTile type={precondition.isSatisfied ? OutputSuccess : OutputError} message={precondition.condition} />
            )}

        </div>
    </div>


}

export const OutputList = () => {
    const { results } = useResults()
    console.log("list update")
    return <div className=" p-5 rounded-2xl mx-auto " style={{ "minWidth": "400pt" }}>
        {results.map(((_, i) =>
            <OutputSubList id={i} index={results.length - i} expanded={i === 0} />
        ))}
    </div>

}
