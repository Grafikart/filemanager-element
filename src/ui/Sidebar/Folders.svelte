<template>
  <ul class="fm-folders">
    {#each folders as folder}
      <Folder folder={folder} lazyLoad={lazyLoad}/>
    {/each}
  </ul>
</template>

<script lang="ts">
  import type { Folder as FolderType } from '../../types'
  import Folder from './Folder.svelte'

  export let folders: (FolderType | null)[]
  export let lazyLoad: boolean
</script>

<style>
  .fm-folders,
  .fm-folders :global(li) {
    margin: 0;
    list-style: none;
    padding: 0;
  }

  .fm-folders :global(ul) {
    margin-left: 25px;
  }
</style>
