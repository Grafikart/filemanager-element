<template>
  {#if files.length > 0}
  <table>
    <thead>
    <tr>
      <th></th>
      <th></th>
      <th>Nom</th>
      <th>Taille</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    {#each files as file}
      <FileRow file={file}/>
    {/each}
    </tbody>
  </table>
  {:else if $filesQuery.isLoading}
    <div class="empty">
      <IconLoader/>
    </div>
  {:else}
    <div class="empty">
      <p class="big">Ce dossier est vide :(</p>
      <p>Déposer un fichier ici pour le téléverser</p>
      {#if isEmpty}
        <button
                class="delete-folder"
                disabled={$deleteFolder.isLoading}
                on:click|preventDefault={$deleteFolder.mutate(folder)}>
          {#if $deleteFolder.isLoading}
          <IconLoader size={12}/>
          {/if}
          Supprimer le dossier
        </button>
      {/if}
    </div>
  {/if}
</template>

<script lang="ts">
  import { useDeleteFolderMutation, filesQueryKey, foldersQueryKey, searchQuery } from '../store'
  import { useQuery } from '@sveltestack/svelte-query'
  import config from '../config'
  import { fetchApi } from '../functions/api'
  import FileRow from './FileRow.svelte'
  import IconLoader from './icons/IconLoader.svelte'
  import type { Folder } from '../types'

  export let folder: Folder | null;
  const deleteFolder = useDeleteFolderMutation()

  const filesQuery = useQuery(
    filesQueryKey(folder?.id),
    () => fetchApi(config.endpoint, '/files', {
      query: {
        folder: folder?.id || undefined
      }
    })
  )

  let files = []
  $: {
    files = $filesQuery.isSuccess ? $filesQuery.data.filter(f => $searchQuery ? f.name.includes($searchQuery) : true) : []
  }


  const folders = useQuery(foldersQueryKey(folder?.id), () => null, {enabled: false})
  $: isEmpty = folder?.id && $folders.isSuccess && $folders?.data?.length === 0 && $filesQuery.isSuccess && $filesQuery?.data?.length === 0
</script>

<style>
  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: var(--fm-color-50);
  }
  .empty p {
    margin: 0;
  }
  .empty .big {
    font-size: 1.2em;
    margin-bottom: .5rem;
  }
  .delete-folder {
    display: flex;
    align-items: center;
    background: var(--fm-red);
    border: none;
    color: white;
    font-family: inherit;
    font-size: inherit;
    padding: .6em 1em;
    margin-top: 1em;
    border-radius: .3em;
    transition: color .3s;
    cursor: pointer;
  }
  .delete-folder :global(div) {
    margin-right: .5em;
  }
  .delete-folder:hover {
    background: var(--fm-red-dark);
  }
  .delete-folder:disabled {
    background: var(--fm-iconColor);
  }
  table,
  table :global(thead),
  table :global(tbody),
  table :global(tr),
  table :global(td),
  table :global(th) {
    display: block;
    font-weight: inherit;
  }
  table :global(thead) {
    font-size: .9em;
    padding-left: 24px;
    text-align: left;
  }
  table :global(tr) {
    padding: 12px 0;
    display: grid;
    grid-template-columns: 70px 250px 1fr 75px 50px;
    align-items: center;
    transition: opacity .5s;
  }
</style>
