import { writable } from 'svelte/store';
import type { File, Folder } from '../types';
import { HTTPStatus } from '../types';
import { QueryClient, useMutation, useQueryClient } from '../query';
import config from '../config';
import { t } from '../lang';
import { flash } from './flash';

export const rootFolder = {
  id: null,
  name: "/",
  parent: null,
};

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
const folderStore = writable<Folder>(rootFolder);

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
    await config.deleteFile(file);
  } catch (e) {
    if (
      !(e instanceof Response) ||
      e.status !== HTTPStatus.UnprocessableEntity
    ) {
      flash(t(`serverError`), "danger");
    }
    queryClient.setQueryData(queryKey, oldData);
  }
};
export const uploadFile = async (
  queryClient: QueryClient,
  file: any,
  folder: Folder
) => {
  try {
    const newFile = await config.uploadFile(file, folder)
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
    }
  }
};

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    config.createFolder,
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
  return useMutation(
    (folder: Folder) =>
      config.deleteFolder(folder).then((r) => folder),
    {
      onSuccess: (folder: Folder) => {
        // If we are deleting the current directory, back to the parent
        folderStore.update((f: Folder | null) => rootFolder);
        // Update the store (both the root and this depth
        const updateData = (parent: Folder["id"]) => {
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
        updateData(null);
      },
    }
  );
};
