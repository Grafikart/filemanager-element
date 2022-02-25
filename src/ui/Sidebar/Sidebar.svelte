<script lang="ts">
  import type { Folder } from "../../types";
  import Folders from "./Folders.svelte";
  import Search from "./Search.svelte";

  const root: Folder = {
    id: "",
    name: "/",
    parent: null,
  };
</script>

<template>
  <aside class="sidebar">
    <Search />
    <Folders folders={[root]} />
  </aside>
</template>

<style>
  .sidebar {
    border-right: 1px solid var(--fm-border);
    padding: 24px;
    overflow: auto;
  }
  .sidebar > :global(*) + :global(*)::before {
    content: "";
    display: block;
    height: 1px;
    background-color: var(--fm-border);
    margin: 1.5em 0;
  }
</style>
