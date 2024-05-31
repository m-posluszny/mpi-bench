import { useState, useEffect } from "react";
import { useResults } from "../Output/Output.hook";
import { post } from "../Api/core";

export const PASSWORD = () => `api/v1/passwords`;

export const useGetPassword = () => { 
    const [loading, setLoading] = useState(false);
    const {addResult} = useResults();

    const [createError, setError] = useState(null);
        useEffect(() => {
            if (loading) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
      }, [loading]);


    return {
        createError,
        loading,
        sendPassword: (password) => { 
            setLoading(true);
            post(PASSWORD(), { password }).then((res) => {
                addResult(res, {
                    passwordLen: password.length,
                });
            }).catch((err) => {
                setError(err);
            })
        } 
    }
} 