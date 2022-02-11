<template>
  <aside class="sidebar">
    <Search />
    <Folders folders={[root]}/>
  </aside>
</template>

<script lang="ts">
  import type { Folder } from '../../types'
  import Folders from './Folders.svelte'
  import Search from './Search.svelte'

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
  .sidebar > :global(*) + :global(*)::before {
    content:'';
    display: block;
    height: 1px;
    background-color: var(--fm-border);
    margin: 1.5em 0;
  }
</style>
