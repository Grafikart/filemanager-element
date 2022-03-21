<script lang="ts">
  import IconUpload from "./icons/IconUpload.svelte";
  import { dragOver } from "../actions/dragOver";
  import { useQueryClient } from "../query";
  import { uploadFile, folder } from "../store";
  let over = false;
  const handleDragOver = () => (over = true);
  const handleDragLeave = () => (over = false);
  const queryClient = useQueryClient();
  const handleDrop = (e: DragEvent) => {
    Array.from(e.dataTransfer!.files).forEach((file) =>
      uploadFile(queryClient, file, $folder)
    );
  };
</script>

<template>
  <main
    class="main"
    use:dragOver
    on:dropzoneover={handleDragOver}
    on:dropzoneleave={handleDragLeave}
    on:drop={handleDrop}
  >
    <slot />
    <span class="dropzone" class:active={over}>
      <IconUpload animated={over} />
    </span>
  </main>
</template>

<style>
  .main {
    position: relative;
    overflow: auto;
  }
  .dropzone {
    pointer-events: none;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.3s;
    color: #fff;
  }
  .active {
    opacity: 1;
  }
  .dropzone::after,
  .dropzone::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .dropzone::before {
    background-color: var(--fm-contrast);
    opacity: 0.6;
  }
  .dropzone::after {
    margin: 10px;
    border-radius: 4px;
    border: dashed 2px var(--fm-contrast);
  }
  .dropzone :global(svg) {
    position: relative;
    z-index: 1;
    width: 100px;
    height: 100px;
  }
</style>
