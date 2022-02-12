<script lang="ts">
  import { clickOutside } from "./actions/clickOutside";
  import { fly } from "svelte/transition";
  import Sidebar from "./ui/Sidebar/Sidebar.svelte";
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
  import Dropzone from "./ui/Dropzone.svelte";
  import FilesList from "./ui/FilesList.svelte";
  import Alerts from "./ui/Alerts/Alerts.svelte";
  import { folder } from "./store";

  export let hidden: boolean;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60000,
      },
    },
  });
</script>

<template>
  <QueryClientProvider client={queryClient}>
    {#if !hidden}
      <div class="root">
        <div class="overlay" transition:fly={{ duration: 300 }}>
          <div
            class="modal"
            transition:fly={{ y: -30, duration: 500 }}
            use:clickOutside={"close"}
          >
            <Sidebar />
            <Dropzone>
              {#key $folder?.id}
                <FilesList folder={$folder} />
              {/key}
            </Dropzone>
            <Alerts />
          </div>
        </div>
      </div>
    {/if}
  </QueryClientProvider>
</template>

<style>
  .root {
    --fm-color: #212944;
    --fm-red: #d04747;
    --fm-green: #72ab39;
    --fm-green-dark: #527f26;
    --fm-red-dark: #9e3030;
    --fm-color-50: rgba(33, 41, 68, 0.5);
    --fm-background: #fefefe;
    --fm-overlay: rgba(254, 254, 254, 0.9);
    --fm-border: #f0f0f6;
    --fm-inputBorder: #d7dee1;
    --fm-backgroundDarken: #f8fafb;
    --fm-iconColor: #c6d0d6;
    --fm-shadow: 0px 1px 4px rgba(212, 212, 212, 0.2);
    --fm-contrast: #457cff;
    --fm-contrastTransparent: #457cff33;
  }
  .overlay {
    background-color: var(--fm-overlay);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal {
    position: relative;
    display: grid;
    grid-template-columns: 278px 1fr;
    width: calc(100vw - 50px);
    max-width: 1200px;
    height: calc(90vh - 50px);
    max-height: 875px;
    color: var(--fm-color);
    background: var(--fm-background);
    border: 1px solid #ebeced;
    box-sizing: border-box;
    box-shadow: var(--fm-shadow);
    border-radius: 8px;
  }
</style>
