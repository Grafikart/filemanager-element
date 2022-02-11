<template>
  <aside class="sidebar">
    <Folders folders={[root]}/>
  </aside>
</template>

<script lang="ts">
  import { Folder } from '../../types'
  import Folders from './Folders.svelte'

  const root: Folder = {
    id: undefined,
    name: '/',
    parent: null
  }
</script>

<style>
  .sidebar {
    border-right: 1px solid var(--fm-border);
    padding: 24px;
  }
</style>
