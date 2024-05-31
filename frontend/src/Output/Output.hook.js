import { useEffect, useState } from "react";
import { useCore} from "../Api/core.hook"
import { useLocalStorage } from "@uidotdev/usehooks";
import { OutputError, OutputLoading, OutputSuccess } from "./Output.type";

export const PASSWORDS = (uid) => `api/v1/passwords/${uid}`;

export const useResults = () => {
    const [results, setResults] = useLocalStorage("results", []);

    const addResult = (result, metadata) => {
        result.date =  new Date().toString();
        result.meta = metadata
        if (results.length > 10) {
            setResults([...results.slice(1), result])
        } else (
        setResults([...results, result])

        )

    }

    const editResult = (i, result) => { 
        result.meta = results[i].meta;
        result.date = results[i].date;
        if ( !result.preconditions ) {
            result.preconditions = results[i].preconditions;
        }
        results[i] = result;
        setResults(results);
    }
    
    return {
        results:results.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
        editResult,
        addResult
    }
}

export const useResult = (i) => {
    const {editResult,  results} = useResults();
    const output = results[i];
    const uid = output?.id;
    let state = OutputError
    if (output?.isProcessing) {
        state = OutputLoading
    } else if (output?.strength > -1 && output?.preconditions?.every && output?.preconditions?.every((prec => prec.isSatisfied))) {
        state = OutputSuccess
    }
    console.log(output, uid)
    console.log("UID", uid)

    const { data, error } = useCore(
        PASSWORDS(uid),
        {},
        typeof uid === "string" && uid !== "",
        {
          refreshInterval: output?.isProcessing ? 100 : 0,
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }
      );

    
    useEffect(() => {
        console.log("DATA UPDATE",data)
        if (data && results[i] !== data) 
        {
            editResult(i, data);
        }
    },[data])

    return {
        state,
        output,
        error,
    }


}