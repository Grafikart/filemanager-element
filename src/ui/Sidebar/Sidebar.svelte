<script lang="ts">
  import Folders from "./Folders.svelte";
  import Search from "./Search.svelte";

  export let lazyFolders: boolean
</script>

<template>
  <aside class="fm-sidebar">
    <Search />
    <Folders folders={[null]} lazyLoad={lazyFolders} />
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
