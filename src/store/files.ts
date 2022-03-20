import { writable } from "svelte/store";
import type { File, FlashMessage, Folder } from "../types";
import type { QueryClient } from "@sveltestack/svelte-query";
import { fetchApi } from "../functions/api";
import config from "../config";
import { useMutation, useQueryClient } from "@sveltestack/svelte-query";

/**
 * Helpers
 */
export const filesQueryKey = (folderId?: Folder["id"] | null) =>
  `files/${folderId || ""}`;
export const foldersQueryKey = (parentId?: Folder["id"] | null) =>
  `folders/${parentId || ""}`;

/**
 * Store
 */
const folderStore = writable<Folder | null>(null);

export const folder = folderStore;
export const searchQuery = writable("");

/*
 * Methods
 */
export const removeFile = async (queryClient: QueryClient, file: File) => {
  const queryKey = filesQueryKey(file.folder);
  const oldData = queryClient.getQueryData(queryKey);
  if (oldData) {
    queryClient.setQueryData<File[]>(queryKey, (files) =>
      files ? files.filter((f) => f.id !== file.id) : []
    );
  }
  try {
    await fetchApi(config.endpoint, `/files/{id}`, {
      method: "delete",
      params: {
        id: file.id.toString(),
      },
    });
  } catch {
    alert(`Impossible de supprimer l'image ${file.name}`);
    queryClient.setQueryData(queryKey, oldData);
  }
};
export const uploadFile = async (
  queryClient: QueryClient,
  file: any,
  folder: Folder | null
) => {
  const form = new FormData();
  form.set("file", file);
  if (folder?.id) {
    form.set("folder", folder.id.toString());
  }
  try {
    const data = await fetchApi(config.endpoint, "/files", {
      method: "post",
      body: form,
    });
    const queryKey = filesQueryKey(folder?.id);
    const state = queryClient.getQueryState(queryKey);
    if (state?.data) {
      queryClient.setQueryData<File[]>(queryKey, (files) =>
        files ? [data, ...files] : data
      );
    }
  } catch (e) {
    console.error(e);
    alert(`Impossible de téléverser ce fichier`);
  }
};

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ name, parent }: { name: string; parent: Folder }) =>
      fetchApi(config.endpoint, "/folders", {
        method: "post",
        json: {
          parent: parent.id!,
          name: name,
        },
      }),
    {
      onSuccess(folder: Folder) {
        // Add the new folder into a specific cache
        const addToCache = (parent: Folder["parent"]) => {
          const queryKey = foldersQueryKey(parent);
          const state = queryClient.getQueryState(queryKey);
          if (state?.data) {
            queryClient.setQueryData<Folder[]>(queryKey, (folders) =>
              folders ? [folder, ...folders] : [folder]
            );
          }
        };
        addToCache(folder.parent);
        addToCache(null);
      },
    }
  );
};

export const useDeleteFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (folder: Folder) =>
      fetchApi(config.endpoint, "/folders/{id}", {
        method: "delete",
        params: {
          id: folder.id!.toString(),
        },
      }).then((r) => folder),
    {
      onSuccess: (folder: Folder) => {
        // If we are deleting the current directory, back to the parent
        folderStore.update((f: Folder | null) =>
          f?.id === folder.id ? null : f
        );
        queryClient.setQueryData<Folder[]>(
          foldersQueryKey(folder.parent),
          (folders) =>
            folders ? folders.filter((f) => f.id !== folder.id) : []
        );
      },
    }
  );
};
