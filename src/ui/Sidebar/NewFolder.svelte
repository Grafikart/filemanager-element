<template>
  <form action="" on:submit|preventDefault={handleSubmit} class="wrapper">
    <IconFolder />
    <input type="text" placeholder="Nom du dossier" name="name" required autofocus/>
    <IconButton><IconArrowRight size={12}/></IconButton>
  </form>
</template>

<script lang="ts">
  import { createFolder, flash } from '../../store'
  import { createEventDispatcher } from 'svelte';
  import IconArrowRight from '../icons/IconArrowRight.svelte'
  import IconFolder from '../icons/IconFolder.svelte'
  import IconButton from '../icons/IconButton.svelte'
  import { useQueryClient } from '@sveltestack/svelte-query'
  import type { Folder } from '../../types'
  const queryClient = useQueryClient()
  export let parent: Folder;
  const handleSubmit = (e: SubmitEvent) => {
    const name = new FormData((e.currentTarget as HTMLFormElement)).get('name').toString()
    createFolder(queryClient, name, parent)
    dispatch('submit')
    flash('Le dossier a bien été créé')
  }
  const dispatch = createEventDispatcher()
</script>

<style>
  .wrapper {
    margin-left: 25px;
    color: var(--fm-iconColor);
    height: 36px;
    display: flex;
    align-items: center;
    padding-left: 8px;
  }
  .wrapper :global(svg) {
    flex: none;
  }
  .wrapper input {
    border: none;
    height: 24px;
    border-bottom: 1px solid var(--fm-iconColor);
    outline: none;
    width: 100%;
    margin-left: 8px;
    font-family: inherit;
    font-size: inherit;
  }
  .wrapper input:focus {
    border-color: var(--fm-contrast);
  }
  .wrapper :global(button) {
    color: var(--fm-color);
    transition: color .3s;
  }
  .wrapper :global(button):hover {
    color: var(--fm-contrast);
  }
</style>
