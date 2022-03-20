<script lang="ts">
  import { useCreateFolderMutation } from "../../store";
  import { autofocus } from "../../actions/autofocus";
  import { clickOutside } from "../../actions/clickOutside";
  import { createEventDispatcher } from "svelte";
  import IconArrowRight from "../icons/IconArrowRight.svelte";
  import IconFolder from "../icons/IconFolder.svelte";
  import IconButton from "../icons/IconButton.svelte";
  import type { Folder } from "../../types";
  import IconLoader from "../icons/IconLoader.svelte";
  import { t } from '../../lang'

  export let parent: Folder;
  const createFolderMutation = useCreateFolderMutation();
  const handleSubmit = async (e: SubmitEvent) => {
    const name = new FormData(e.currentTarget as HTMLFormElement)
      .get("name")!
      .toString();
    await $createFolderMutation.mutateAsync({ name, parent });
    dispatch("submit");
  };
  const handleCancel = () => {
    dispatch("cancel");
  };
  const dispatch = createEventDispatcher();
</script>

<template>
  <form
    action=""
    on:submit|preventDefault={handleSubmit}
    class="wrapper"
    use:clickOutside
    on:outclick={handleCancel}
  >
    <IconFolder />
    <input
      type="text"
      placeholder={t('newFolderPlaceholder')}
      name="name"
      required
      use:autofocus
      disabled={$createFolderMutation.isLoading}
    />
    <IconButton disabled={$createFolderMutation.isLoading}>
      {#if $createFolderMutation.isLoading}
        <IconLoader size={12} />
      {:else}
        <IconArrowRight size={12} />
      {/if}
    </IconButton>
  </form>
</template>

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
    transition: color 0.3s;
  }
  .wrapper :global(button):hover {
    color: var(--fm-contrast);
  }
</style>
