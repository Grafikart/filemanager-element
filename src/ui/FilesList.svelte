<template>
  {#if files.length > 0}
    {#if layout === 'rows'}
      <FilesListRows files={files}/>
    {:else}
      <FilesListGrid files={files}/>
    {/if}
  {:else if $filesQuery.isLoading}
    <div class="empty">
      <IconLoader/>
    </div>
  {:else}
    <div class="empty">
      <p class="big">{t('emptyTitle')}</p>
      <p>{t('emptyDescription')}</p>
      {#if isEmpty && !options.readOnly}
        <button
                class="delete-folder"
                disabled={$deleteFolder.isLoading}
                on:click|preventDefault={handleDelete}
        >
          {#if $deleteFolder.isLoading}
            <IconLoader size={12}/>
          {/if}
          {t('deleteFolder')}
        </button>
      {/if}
    </div>
  {/if}
</template>

<script lang="ts">
  import { filesQueryKey, foldersQueryKey, getOptions, searchQuery, useDeleteFolderMutation } from '../store';
  import { useQuery } from '../query';
  import IconLoader from './icons/IconLoader.svelte';
  import type { File, Folder } from '../types';
  import FilesListRows from './FilesListRows.svelte'
  import FilesListGrid from './FilesListGrid.svelte'
  import { t } from '../lang'

  export let layout: 'grid' | 'rows'
  export let folder: Folder | null;
  const options = getOptions()
  const deleteFolder = useDeleteFolderMutation();
  const handleDelete = () => {
    if (folder) {
      $deleteFolder.mutate(folder);
    }
  };

  const filesQuery = useQuery(filesQueryKey(folder?.id), () =>
    getOptions().getFiles(folder)
  );

  let files = [] as File[];
  $: {
    files = $filesQuery.isSuccess
      ? $filesQuery.data!.filter((f: File) =>
        $searchQuery ? f.name.includes($searchQuery) : true
      )
      : [];
  }

  // Fake query to retrieve folder informations
  const folders = useQuery(foldersQueryKey(folder?.id), () => [] as Folder[], {
    enabled: false
  });
  $: isEmpty =
    folder?.id &&
    (folder?.children && folder.children.length === 0 || $folders.isSuccess &&
      $folders?.data?.length === 0) &&
    $filesQuery.isSuccess &&
    $filesQuery?.data?.length === 0;
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
</style>
