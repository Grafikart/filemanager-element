import { createContext } from "preact";
import { useFetch, useFetchCallback } from "./hooks/useFetch";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import type { Folder, ID, File } from "./types";
import { fetchApi } from "./functions/api";

interface FileManagerContextInterface {
    folders: Folder[];
    files: File[];
    currentFolder: ID | null;
    setCurrentFolder: (id: ID) => void;
}

const FileManagerContext = createContext<FileManagerContextInterface>({
    folders: [],
    files: [],
    currentFolder: null,
    setCurrentFolder: () => null,
});

export function useFileManagerContext() {
    return useContext(FileManagerContext);
}

export function FileManagerContextProvider({
    endpoint,
    children,
}: {
    endpoint: string;
    children: JSX.Element;
}) {
    const fetchApi = useFetchCallback();
    const { data: folders, setData: setFolders } = useFetch(`/folders`);
    const [currentFolder, setCurrentFolder] = useState<ID>(6);
    const { data: files } = useFetch(
        `/files`,
        { query: { folder: currentFolder.toString() } },
        [currentFolder]
    );

    useEffect(() => {
        if (!currentFolder) {
            return;
        }
        const folder = (folders ?? []).find((f) => f.id === currentFolder);
        if (
            folder &&
            folder.hasChildren &&
            (folders ?? []).filter((f) => f.parent === currentFolder).length ===
                0
        ) {
            const data = fetchApi("/folders", {
                query: { parent: currentFolder.toString() },
            }).then((data) => {
                setFolders((f) => [...(f ?? []), ...data]);
            });
        }
    }, [currentFolder, folders]);

    return (
        <FileManagerContext.Provider
            value={{
                folders: folders ?? [],
                files: files ?? [],
                currentFolder,
                setCurrentFolder,
            }}
        >
            {children}
        </FileManagerContext.Provider>
    );
}
