<template>
  <QueryClientProvider client={queryClient}>
  <div class="root">
    <div class="overlay">
      <div class="modal">
        <Sidebar/>
        <Dropzone>
          <FilesList />
        </Dropzone>
        <Alerts />
      </div>
    </div>
  </div>
  </QueryClientProvider>
</template>

<script>
  import Sidebar from './ui/Sidebar/Sidebar.svelte'
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
  import Dropzone from './ui/Dropzone.svelte'
  import FilesList from './ui/FilesList.svelte'
  import Alerts from './ui/Alerts/Alerts.svelte'

  const queryClient = new QueryClient({
    defaultOptions:{
      queries: {
        refetchOnWindowFocus: false,
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
    --fm-border: #F0F0F6;
    --fm-inputBorder: #D7DEE1;
    --fm-backgroundDarken: #F8FAFB;
    --fm-iconColor: #C6D0D6;
    --fm-shadow: 0px 1px 4px rgba(212, 212, 212, 0.2);
    --fm-contrast: #457CFF;
    --fm-contrastTransparent: #457CFF33;
  }
  .overlay {
    background-color: var(--fm-backgroundDarken);
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
