import { useState } from "react";

const useApi = <T>() => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const getApiHandler = (func: (...args: any) => Promise<{ status: number; data: T }>, ...args: any) => {
        setIsLoading(true);
        setIsSuccess(false);
        return new Promise((resolve, reject) => {
            func(...args)
            .then((response: { status: number; data: T }) => {
                if(response.status === 200) {
                    setData(response.data);
                    resolve(response.data);
                    setIsSuccess(true);
                }
            })
            .catch((error: any) => {
                console.error("Error fetching data:", error);
                setError(error);
                reject(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
        })

    }
    return {getApiHandler, isLoading, data, isSuccess, error};
}

export default useApi;