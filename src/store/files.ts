import { writable } from 'svelte/store'
import type { File, FlashMessage, Folder } from '../types'
import type { QueryClient } from '@sveltestack/svelte-query'
import { fetchApi } from '../functions/api'
import config from '../config'
import { useMutation, useQueryClient } from '@sveltestack/svelte-query'

/**
 * Helpers
 */
export const filesQueryKey = (folderId?: Folder['id'] | null) => `files/${folderId || ''}`
export const foldersQueryKey = (parentId?: Folder['id'] | null) => `folders/${parentId || ''}`

/**
 * Store
 */
const folderStore = writable<Folder|null>(null)

export const folder = folderStore

/*
* Methods
 */
export const removeFile = async (queryClient: QueryClient, file: File) => {
  const queryKey = filesQueryKey(file.folder);
  const oldData = queryClient.getQueryData(queryKey)
  queryClient.setQueryData(queryKey, (files: File[]) => files.filter(f => f.id !== file.id))
  try {
    await fetchApi(config.endpoint, `/files/{id}`, {
      method: 'delete',
      params: {
        id: file.id.toString()
      }
    })
  } catch {
    alert(`Impossible de supprimer l'image ${file.name}`)
    queryClient.setQueryData(queryKey, oldData)
  }
}
export const uploadFile = async (queryClient: QueryClient, file: any, folder: Folder|null) => {
  const form = new FormData()
  form.set('file', file)
  if (folder?.id) {
    form.set('folder', folder.id.toString())
  }
  try {
    const data = await fetchApi(config.endpoint, '/files', {
      method: 'post',
      body: form,
    })
    const queryKey = filesQueryKey(folder?.id)
    const state = queryClient.getQueryState(queryKey)
    if (state?.data) {
      queryClient.setQueryData(queryKey, (files: File[]) => [data, ...files])
    }
  } catch (e) {
    console.error(e)
    alert(`Impossible de téléverser ce fichier`)
  }
}
export const createFolder = async (queryClient: QueryClient, name: string, parent: Folder) => {
  try {
    const data = await fetchApi(config.endpoint, '/folders', {
      method: 'post',
      json: {
        parent: parent.id,
        name: name
      }
    })
    const queryKey = foldersQueryKey(parent.id)
    const state = queryClient.getQueryState(queryKey)
    if (state?.data) {
      queryClient.setQueryData(queryKey, (folders: Folder[]) => [data, ...folders])
    }
  } catch (e) {
    console.error(e)
    alert(`Impossible de créer ce dossier`)
  }
}

export const useDeleteFolderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation((folder: Folder) =>
      fetchApi(config.endpoint, '/folders/{id}', {
        method: 'delete',
        params: {
          id: folder.id.toString()
        }
      }).then(r => folder)
    , {
      onSuccess: (folder: Folder) => {
        // If we are deleting the current directory, back to the parent
        folderStore.update((f: Folder) => f.id === folder.id ? null : f)
        queryClient.setQueryData(foldersQueryKey(folder.parent), (folders: Folder[]) => folders.filter(f => f.id !== folder.id))
      },
    })
}

