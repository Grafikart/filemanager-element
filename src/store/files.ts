import { writable } from "svelte/store";
import type { File, Folder, NullableId, Options } from "../types";
import { HTTPStatus } from "../types";
import { QueryClient, useMutation, useQueryClient } from "../query";
import { t } from "../lang";
import { flash } from "./flash";
import { getOptions } from "./index";

/**
 * Helpers
 */
export const filesQueryKey = (folderId?: NullableId) =>
  `files/${folderId ?? ""}`;
export const foldersQueryKey = (parentId?: NullableId) =>
  `folders/${parentId ?? ""}`;

/**
 * Store
 */
const folderStore = writable<Folder | null>(null);

export const folder = folderStore;
export const searchQuery = writable("");

/*
 * Methods
 */
export const removeFile = async (
  options: Options,
  queryClient: QueryClient,
  file: File
) => {
  const queryKey = filesQueryKey(file.folder);
  const oldData = queryClient.getQueryData(queryKey);
  if (oldData) {
    queryClient.setQueryData<File[]>(queryKey, (files) =>
      files ? files.filter((f) => f.id !== file.id) : []
    );
  }
  try {
    await options.deleteFile(file);
  } catch (e) {
    if (
      !(e instanceof Response) ||
      e.status !== HTTPStatus.UnprocessableEntity
    ) {
      flash(t(`serverError`), "danger");
      console.error(e);
    }
    queryClient.setQueryData(queryKey, oldData);
  }
};
export const uploadFile = async (
  options: Options,
  queryClient: QueryClient,
  file: any,
  folder?: Folder | null
) => {
  try {
    const newFile = await options.uploadFile(file, folder);
    const queryKey = filesQueryKey(folder?.id);
    const state = queryClient.getQueryState(queryKey);
    if (state?.data) {
      queryClient.setQueryData<File[]>(queryKey, (files) =>
        files ? [newFile, ...files] : [newFile]
      );
    }
  } catch (e) {
    if (
      !(e instanceof Response) ||
      e.status !== HTTPStatus.UnprocessableEntity
    ) {
      flash(t(`serverError`), "danger");
      console.error(e);
    }
  }
};

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();
  const options = getOptions();
  return useMutation(
    (params: Pick<Folder, "name" | "parent">) => options.createFolder(params),
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
        if (folder.parent) {
          addToCache(null);
        }
      },
    }
  );
};

export const useDeleteFolderMutation = () => {
  const queryClient = useQueryClient();
  const options = getOptions();
  return useMutation(
    (folder: Folder) => options.deleteFolder(folder).then((r) => folder),
    {
      onSuccess: (folder: Folder) => {
        // If we are deleting the current directory, back to the parent
        folderStore.update(() => null);
        // Update the store (both the root and this depth
        const updateData = (parent?: Folder["id"] | null) => {
          const queryKey = foldersQueryKey(parent);
          const state = queryClient.getQueryState(queryKey);
          if (state?.data) {
            queryClient.setQueryData<Folder[]>(
              foldersQueryKey(parent),
              (folders) =>
                folders ? folders.filter((f) => f.id !== folder.id) : []
            );
          }
        };
        updateData(folder.parent);
        updateData();
      },
    }
  );
};
