<template>
  <table>
    <thead>
    <tr>
      <th></th>
      <th></th>
      <th>{t('filename')}</th>
      <th>{t('size')}</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    {#each files as file}
      <FileRow file={file}/>
    {/each}
    </tbody>
  </table>
</template>

<script lang="ts">
import FileRow from './FileRow.svelte'
import type { File } from '../types'
import { t } from '../lang'

export let files: File[]
</script>

<style>
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
    grid-template-columns: 70px 250px 1fr 75px 75px;
    align-items: center;
    transition: opacity .5s;
  }
</style>
