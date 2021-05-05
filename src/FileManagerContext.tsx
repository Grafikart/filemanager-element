import { createContext } from "preact";
import { useFetch, useFetchCallback } from "./hooks/useFetch";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import type { Folder, ID, File } from "./types";

interface FileManagerContextInterface {
  folders: Folder[];
  files: File[];
  currentFolder: ID | null;
  setCurrentFolder: (id: ID) => void;
  uploadFiles: (files: FileList, folder: ID) => Promise<any>;
  deleteFile: (file: File) => Promise<any>;
}

const FileManagerContext = createContext<FileManagerContextInterface>({
  folders: [],
  files: [],
  currentFolder: null,
  setCurrentFolder: () => null,
  uploadFiles: () => Promise.reject(),
  deleteFile: () => Promise.reject(),
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
  const { data: files, setData: setFiles } = useFetch(
    `/files`,
    { query: { folder: currentFolder.toString() } },
    [currentFolder]
  );

  const deleteFile = useCallback(async (file: File) => {
    await fetchApi("/files/{id}", {
      method: "delete",
      params: { id: file.id.toString() },
    });
    setFiles((files) => files!.filter((f) => f !== file));
  }, []);

  const uploadFiles = useCallback(
    async (files: FileList, folder: ID) => {
      const form = new FormData();
      return Promise.all(
        Array.from(files).map(async (f) => {
          form.set("file", f);
          form.set("folder", folder.toString());
          const file = await fetchApi("/files", {
            method: "post",
            body: form,
          });
          if (file.folder.toString() === currentFolder.toString()) {
            setFiles((f) => [file, ...(f ?? [])]);
          }
        })
      );
    },
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
      (folders ?? []).filter((f) => f.parent === currentFolder).length === 0
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
        uploadFiles,
        deleteFile,
        currentFolder,
        setCurrentFolder,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
}
