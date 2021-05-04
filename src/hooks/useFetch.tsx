import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { createContext } from "preact";
import { fetchApi } from "../functions/api";
import type {
    ApiResponse,
    FetchOptions,
    Methods,
    Paths,
} from "../functions/api";

const FetchContext = createContext({
    baseUrl: "/",
});

export function FetchContextProvider({
    baseUrl,
    children,
}: {
    baseUrl: string;
    children: JSX.Element;
}) {
    return (
        <FetchContext.Provider value={{ baseUrl }}>
            {children}
        </FetchContext.Provider>
    );
}

export function useFetch<E extends Paths, M extends Methods = "get">(
    endpoint: E,
    options?: FetchOptions<E, M>,
    deps: any[] = []
) {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ApiResponse<E, M> | null>(null);
    const { baseUrl } = useContext(FetchContext);

    useEffect(() => {
        if (deps !== null) {
            setLoading(true);
            fetchApi(baseUrl, endpoint, options)
                .then(setData)
                .finally(() => {
                    setLoading(false);
                });
        }
    }, deps);

    return {
        loading,
        data,
        setData,
    };
}

export function useFetchCallback() {
    const { baseUrl } = useContext(FetchContext);
    function callback<Path extends Paths, Method extends Methods = "get">(
        path: Path,
        options?: FetchOptions<Path, Method>
    ): Promise<ApiResponse<Path, Method>> {
        return fetchApi(baseUrl, path, options);
    }
    return useCallback(callback, []);
}
