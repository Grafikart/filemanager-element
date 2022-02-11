<template>
  <ul class="folders">
    {#each folders as folder}
      <Folder folder={folder}/>
    {/each}
  </ul>
</template>

<script lang="ts">
  import type { Folder as FolderType } from '../../types'
  import Folder from './Folder.svelte'

  export let folders: FolderType[]
</script>

<style>
  .folders,
  .folders :global(li) {
    margin: 0;
    list-style: none;
    padding: 0;
  }

  .folders :global(ul) {
    margin-left: 25px;
  }
</style>
