<script lang="ts">
  import type { Folder } from '../../types';
  import { useQuery, useQueryClient } from '../../query';
  import IconLoader from '../icons/IconLoader.svelte';
  import IconFolder from '../icons/IconFolder.svelte';
  import Folders from './Folders.svelte';
  import { folder as currentFolder, foldersQueryKey, getOptions, uploadFile } from '../../store';
  import { dragOver } from '../../actions/dragOver';
  import IconCirclePlus from '../icons/IconCirclePlus.svelte';
  import NewFolder from './NewFolder.svelte';
  import { nestFolder } from '../../functions/folders'
  import { t } from '../../lang'
  import { tooltip } from '../../actions/tooltip'

  const queryClient = useQueryClient();
  export let folder: Folder | null;
  export let lazyLoad: boolean;

  let over = false;
  let addNewFolder = false;
  let showChildren = !folder?.id

  const options = getOptions()
  const handleDragOver = () => {
    if (!options.readOnly) { over = true }
  };
  const handleDragLeave = () => {
    if (!options.readOnly) { over = false }
  };
  const handleDrop = (e: DragEvent) => {
    if (options.readOnly) {
      e.preventDefault()
    }
    Array.from(e.dataTransfer!.files).forEach((file) =>
      uploadFile(options, queryClient, file, folder)
    );
  };
  const handleAddFolder = () => {
    addNewFolder = true;
    showChildren = true;
    if (!$childrenQuery.isSuccess && folder?.children === undefined) {
      $childrenQuery.refetch();
    }
  };
  const exitAddFolder = () => {
    addNewFolder = false;
  };
  const loadChildren = () => {
    // Unfold the directory if it's already selected
    if (showChildren && $currentFolder === folder) {
      showChildren = false
      return
    }
    showChildren = true
    $currentFolder = folder;
    // Do not prefetch if we already have children loaded
    if (folder?.children === undefined) {
      $childrenQuery.refetch();
    }
  };

  const childrenQuery = useQuery(
    foldersQueryKey(folder?.id),
    () => options.getFolders(folder?.id ? folder : undefined),
    {
      enabled: !folder?.id
    }
  );

  let children: Folder[] | null = null
  $: {
    if ($childrenQuery.isSuccess) {
      children = (lazyLoad ? $childrenQuery.data! : nestFolder($childrenQuery.data!)).filter((f: Folder) => (f.parent ?? null) === (folder?.id ?? null));
    }
  }
</script>

<template>
  <li>
    <span
            class="fm-folder-wrapper"
            class:active={folder?.id === $currentFolder?.id || over}
    >
      <span
              class="fm-folder"
              use:dragOver
              on:click|preventDefault={loadChildren}
              on:dropzoneover={handleDragOver}
              on:dropzoneleave={handleDragLeave}
              on:drop={handleDrop}
      >
        {#if $childrenQuery.isLoading}
          <IconLoader size={20} class="folder-loader"/>
        {:else}
          <IconFolder class="folder-icon"/>
        {/if}
        <span class="fm-folder-name">
          {folder?.name ?? '/'}
        </span>
      </span>
      {#if !options.readOnly}
      <button class="fm-new-folder" on:click|preventDefault={handleAddFolder} use:tooltip={t('createFolder')}>
        <IconCirclePlus size={16}/>
      </button>
      {/if}
    </span>
    {#if addNewFolder}
      <NewFolder
              parent={folder}
              on:submit={exitAddFolder}
              on:cancel={exitAddFolder}
      />
    {/if}
    {#if folder?.children && showChildren}
      <Folders folders={folder?.children} lazyLoad={lazyLoad}/>
    {:else if children && showChildren}
      <Folders folders={children} lazyLoad={lazyLoad}/>
    {/if}
  </li>
</template>

<style>
  .fm-folder-wrapper {
    display: block;
    position: relative;
    --fm-folderColor: var(--fm-iconColor);
    --fm-nameColor: var(--fm-color);
  }

  .fm-folder-wrapper.active {
    --fm-folderColor: var(--fm-contrast);
    --fm-nameColor: var(--fm-contrast);
  }

  .fm-new-folder {
    border: none;
    background-color: transparent;
    font-weight: bold;
    position: absolute;
    height: 36px;
    width: 36px;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    color: var(--fm-folderColor);
    transition: 0.3s;
  }

  .fm-new-folder:hover {
    color: var(--fm-color);
  }

  .fm-folder {
    position: relative;
    display: flex;
    height: 36px;
    list-style: none;
    align-items: center;
    font-weight: 500;
    padding: 0 8px;
    border-radius: 6px;
    transition: background 0.3s, color 0.3s;
    flex-wrap: wrap;
    cursor: pointer;
    color: var(--fm-iconColor);
  }

  .fm-folder-name {
    color: var(--fm-nameColor);
    overflow: hidden;
    margin-right: 1.5em;
    white-space: nowrap;
    flex: 1;
    width: 100%;
    text-overflow: ellipsis;
  }

  .fm-folder :global(.folder-icon) {
    color: var(--fm-folderColor);
    width: 23px;
    height: 23px;
    margin-right: 8px;
    transition: color 0.3s;
  }

  .fm-folder :global(.folder-loader) {
    margin: 2px 9px 2px 2px;
  }

  .fm-folder-wrapper.active .fm-folder::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--fm-contrast);
    opacity: 0.1;
    border-radius: 6px;
  }
</style>
