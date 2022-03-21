<script lang="ts">
  import type { Folder } from "../../types";
  import Folders from "./Folders.svelte";
  import Search from "./Search.svelte";
  import { rootFolder } from '../../store'

  export let lazyFolders: boolean

  const root: Folder = rootFolder;
</script>

<template>
  <aside class="fm-sidebar">
    <Search />
    <Folders folders={[root]} lazyLoad={lazyFolders} />
  </aside>
</template>

<style>
  .fm-sidebar {
    border-right: 1px solid var(--fm-border);
    padding: 24px;
    overflow: auto;
  }
  .fm-sidebar > :global(*) + :global(*)::before {
    content: "";
    display: block;
    height: 1px;
    background-color: var(--fm-border);
    margin: 1.5em 0;
  }
</style>
