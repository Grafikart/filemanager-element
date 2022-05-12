<script lang="ts">
  import IconUpload from "./icons/IconUpload.svelte";
  import { dragOver } from "../actions/dragOver";
  import { useQueryClient } from "../query";
  import { uploadFile, folder, getOptions, uploads } from '../store';
  let over = false;
  const handleDragOver = () => (over = true);
  const handleDragLeave = () => (over = false);
  const queryClient = useQueryClient();
  const options = getOptions()
  const handleDrop = (e: DragEvent) => {
    Array.from(e.dataTransfer!.files).forEach(async (file) => {
      uploads.push(file)
      await uploadFile(options, queryClient, file, $folder)
      uploads.remove(file)
    });
  };
</script>

<template>
  {#if options.readOnly}
    <main class="fm-main">
      <slot/>
    </main>
  {:else}
    <main
            class="fm-main"
            use:dragOver
            on:dropzoneover={handleDragOver}
            on:dropzoneleave={handleDragLeave}
            on:drop={handleDrop}
    >
      <slot />
      <span class="fm-dropzone" class:active={over}>
      <IconUpload animated={over} />
    </span>
    </main>
  {/if}
</template>

<style>
  .fm-main {
    position: relative;
    overflow: auto;
  }
  .fm-dropzone {
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
  .fm-dropzone::after,
  .fm-dropzone::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .fm-dropzone::before {
    background-color: var(--fm-contrast);
    opacity: 0.6;
  }
  .fm-dropzone::after {
    margin: 10px;
    border-radius: 4px;
    border: dashed 2px var(--fm-contrast);
  }
  .fm-dropzone :global(svg) {
    position: relative;
    z-index: 1;
    width: 100px;
    height: 100px;
  }
</style>
