import { parseForm } from "../Misc/forms";
import { FormGroup, FormRow } from "../Misc/UI.component";
import { usePresets } from "./preset.hook"
import { useState } from "react";

const inputClass = "ml-auto rounded text-black";
const labelClass = "text-white mr-4";

export const PlusMinus = ({ setCnt, Cnt, min }) =>
    <>
        <button className="bg-green-500 rounded-2xl px-2 font-bold me-2" onClick={() => setCnt(Cnt + 1)} type="button">
            +
        </button>
        <button className="bg-orange-500 rounded-2xl px-2 font-bold" onClick={() => setCnt(Math.max(min, Cnt - 1))} type="button">
            -
        </button>
    </>

export const ParameterForm = ({ idx }) => {
    const [subParam, setSubParam] = useState(0);
    return <div>
        <h3>
            Parameter {idx + 1}
        </h3>
        <FormGroup key={idx}>
            <FormRow>
                <label className={labelClass}>
                    n_proc
                </label>
                <input className={inputClass} type="number" name={`${idx}_n_proc`} required min={1} max={32} />
            </FormRow>
            <FormRow>
                <label className={labelClass}>
                    flags
                </label>
                <PlusMinus setCnt={setSubParam} Cnt={subParam} min={0} />
            </FormRow>
            {[...Array(subParam)].map((_, i) => (
                <FormGroup key={idx + i}>
                    < FormRow >
                        <input className="mr-4 text-black rounded" type="text" name={`${idx}.${i}.fkey`} required placeholder="flag name" />
                        <input className={inputClass} type="text" name={`${idx}.${i}.fval`} required placeholder="value" />
                    </FormRow>
                </FormGroup>
            ))}


        </FormGroup >
    </div >
}

const parametersFromForm = (input) => {
    const output = [];

    for (let key in input) {
        if (key.endsWith("_n_proc")) {
            const index = key.split("_")[0];
            const n_proc = input[key];
            const flags = {};

            for (let flagKey in input) {
                const [paramIndex, flagIndex, flagField] = flagKey.split(".");
                console.log(flagKey.split("."), flagIndex, flagField)
                if (paramIndex === index) {
                    const fkey = input[`${index}.${flagIndex}.fkey`]
                    const fval = input[`${index}.${flagIndex}.fval`]
                    flags[fkey] = fval
                };
            }
            output.push({ n_proc, flags });
        }
    }
    return output;
}





export const PresetCreateView = () => {

    const { createPreset } = usePresets();

    const [paramCnt, setParamCnt] = useState(1);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        let data = parseForm(event);
        console.log(data)
        const form = event.target;
        const parameters = parametersFromForm(data)
        return createPreset({ name: data.name, description: data.description, parameters, trigger_new: data.trigger_new })
            .then(data => {
                alert('Preset created successfully');
                form.reset()
                setParamCnt(0);
                setParamCnt(1);
            })
            .catch(error => {
                console.log(error)
                alert(`File and metadata uploda error: ${error.detail}`);
            });
    };


    return (
        <form className="bg-slate-600 rounded-xl px-10 py-2 h-fit" onSubmit={handleFormSubmit}>
            <div className="text-white font-bold my-3">
                Create Preset
            </div>
            <FormRow>
                <label className={labelClass}>
                    Name:
                </label>
                <input className={inputClass} type="text" name="name" required />
            </FormRow>
            <FormRow>
                <label className={labelClass}>
                    Description:
                </label>
                <input className={inputClass} type="text" name="description" />
            </FormRow>
            <FormRow>
                <label className={labelClass}>
                    Trigger on upload
                </label>
                <input type="checkbox" name="trigger_new" value="true" />
            </FormRow>
            <FormRow>
                <label className={labelClass}>
                    {`Parameters: ${paramCnt}`}
                </label>
                <PlusMinus setCnt={setParamCnt} Cnt={paramCnt} min={1} />
            </FormRow>
            {[...Array(paramCnt)].map((_, i) => (
                <ParameterForm idx={i} />
            ))}
            <FormRow>
                <button className="bg-orange-600 rounded-2xl p-2 px-4 mx-auto my-2" type="submit">Create</button>
            </FormRow>
        </form>
    );
};

