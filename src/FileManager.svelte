<template>
  <QueryClientProvider client={queryClient}>
    {#if !hidden}
      <div class="root">
        <div class="overlay" transition:fly={{duration: 300}}>
          <div class="modal" transition:fly={{y: -30, duration: 500}} use:clickOutside={'close'}>
            <Sidebar/>
            <Dropzone>
              {#key $folder?.id}
                <FilesList folder={$folder} layout={layout}/>
              {/key}
            </Dropzone>
            <Alerts/>
          </div>
        </div>
      </div>
    {/if}
  </QueryClientProvider>
</template>

<script lang="ts">
  import { clickOutside } from './actions/clickOutside'
  import { fly } from 'svelte/transition'
  import Sidebar from './ui/Sidebar/Sidebar.svelte'
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
  import Dropzone from './ui/Dropzone.svelte'
  import FilesList from './ui/FilesList.svelte'
  import Alerts from './ui/Alerts/Alerts.svelte'
  import { folder } from './store'

  export let hidden: boolean
  export let layout: 'grid' | 'rows'

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60000
      }
    }
  })
</script>

<style>
  .root {
    --fm-color: #212944;
    --fm-red: #d04747;
    --fm-green: #72ab39;
    --fm-green-dark: #527f26;
    --fm-red-dark: #9e3030;
    --fm-color-50: rgba(33, 41, 68, .5);
    --fm-background: #FEFEFE;
    --fm-overlay: rgba(254, 254, 254, 0.9);
    --fm-border: #F0F0F6;
    --fm-inputBorder: #D7DEE1;
    --fm-backgroundDarken: #F8FAFB;
    --fm-iconColor: #C6D0D6;
    --fm-shadow: 0px 1px 4px rgba(212, 212, 212, 0.2);
    --fm-img-shadow: 0px 1px 5px rgba(212, 212, 212, .7);
    --fm-contrast: #457CFF;
    --fm-contrastTransparent: #457CFF33;
  }

  .root :global(*::-webkit-scrollbar) {
    width: 7px;
    height: 7px;
  }

  .root :global(*::-webkit-scrollbar-track) {
    background: var(--fm-background);
    padding: 1px;
  }

  .root :global(*::-webkit-scrollbar-thumb) {
    background: var(--fm-border);
    border-radius: 4px;
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
    border: 1px solid #EBECED;
    box-sizing: border-box;
    box-shadow: var(--fm-shadow);
    border-radius: 8px;
  }
</style>
