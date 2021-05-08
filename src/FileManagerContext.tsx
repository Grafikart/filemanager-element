import { createContext } from "preact";
import { useFetch, useFetchCallback } from "./hooks/useFetch";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";
import type { File, Folder, ID } from "./types";

interface FileManagerContextInterface {
  folders: Folder[];
  files: File[];
  search: string;
  fileLoading: boolean;
  currentFolder: ID | undefined;
  setCurrentFolder: (id: ID) => void;
  uploadFiles: (files: FileList, folder: ID) => Promise<any>;
  deleteFile: (file: File) => Promise<any>;
  setSearch: (search: string) => void;
}

const FileManagerContext = createContext<FileManagerContextInterface>({
  folders: [],
  files: [],
  search: "",
  fileLoading: false,
  currentFolder: undefined,
  setCurrentFolder: () => null,
  uploadFiles: () => Promise.reject(),
  deleteFile: () => Promise.reject(),
  setSearch: () => null,
});

export function useFileManagerContext() {
  return useContext(FileManagerContext);
}

export function FileManagerContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const fetchApi = useFetchCallback();
  const { data: folders, setData: setFolders } = useFetch(`/folders`);
  const [currentFolder, setCurrentFolder] = useState<ID | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const currentFolderRef = useRef(currentFolder);
  const { data: files, setData: setFiles, loading: fileLoading } = useFetch(
    `/files`,
    {
      query: {
        folder: currentFolder?.toString(),
        search: search || undefined,
      },
    },
    [currentFolder, search]
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
          if (file.folder.toString() === currentFolder?.toString()) {
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
        query: {
          parent: currentFolder.toString(),
        },
      }).then((data) => {
        setFolders((f) => [...(f ?? []), ...data]);
      });
    }
  }, [currentFolder, folders]);

  const setCurrentFolderEmptySearch = (value: ID) => {
    setCurrentFolder(value);
    setSearch("");
    currentFolderRef.current = value;
  };

  const setSearchResetFolder = (value: string) => {
    setCurrentFolder(value === "" ? currentFolderRef.current : undefined);
    setSearch(value.trim());
  };

  return (
    <FileManagerContext.Provider
      value={{
        search,
        folders: folders ?? [],
        files: files ?? [],
        uploadFiles,
        deleteFile,
        currentFolder,
        fileLoading,
        setCurrentFolder: setCurrentFolderEmptySearch,
        setSearch: setSearchResetFolder,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
}
