<template>
  <div class="grid">
    {#each files as file}
      <FileCell file={file}/>
    {/each}
  </div>
</template>

<script lang="ts">
import FileCell from './FileCell.svelte'
import type { File } from '../types'

export let files: File[]
</script>

<style>
  .grid {
    display: grid;
    margin: 1rem .5rem;
    grid-row-gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(150px, max-content));
  }
</style>
