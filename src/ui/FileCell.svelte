<template>
  <div class="fm-file" on:click={actions.handleClick} bind:this={el}>
    <div class="fm-thumbnail">
      <img src={file.thumbnail} alt=""/>
      {#if !options.readOnly}
      <button use:tooltip={t("delete")}
              class="fm-delete"
              on:click|preventDefault|stopPropagation={actions.handleDelete}>
        <IconDelete/>
      </button>
      {/if}
    </div>
    <div class="fm-filename">{filename}</div>
  </div>
</template>

<script lang="ts">
  import type { File } from '../types'
  import { shorten } from '../functions/string'
  import { useFileActions } from '../hooks/useFileActions'
  import IconDelete from './icons/IconDelete.svelte'
  import { tooltip } from '../actions/tooltip'
  import { t } from '../lang'
  import { getOptions } from '../store'

  let el: HTMLDivElement
  const options = getOptions()
  export let file: File
  $: filename = shorten(file.name, 30)
  $: actions = useFileActions(file, el)
</script>

<style>
  .fm-thumbnail {
    background-color: var(--fm-backgroundDarken);
    width: 105px;
    height: 105px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1em;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color .3s;
    position: relative;
  }
  .fm-thumbnail img {
    --fm-size: 7px;
    max-width: 100%;
    max-height: 100%;
    box-shadow: var(--fm-img-shadow);
    border: 5px solid var(--fm-background);
    background-color: #dedede;
    background-image: linear-gradient(45deg, #FFFFFFFF 25%, transparent 25%), linear-gradient(-45deg, #FFFFFFFF 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #FFFFFFFF 75%), linear-gradient(-45deg, transparent 75%, #FFFFFFFF 75%);
    background-size: calc(var(--fm-size) * 2) calc(var(--fm-size) * 2);
    background-position: 0 0, 0 var(--fm-size), var(--fm-size) calc(var(--fm-size) * -1), calc(var(--fm-size) * -1) 0px;
  }
  .fm-file:hover .fm-thumbnail {
    background: var(--fm-border);
  }
  .fm-filename {
    margin-top: .5em;
    text-align: center;
    font-size: .9em;
    padding: 0 .4em;
    word-break: break-all;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fm-file:hover button {
    opacity: 1;
  }
  .fm-delete {
    opacity: 0;
    position: absolute;
    top: -3px;
    right: -3px;
    border: none;
    display: block;
    background: none;
    color: var(--fm-iconColor);
    cursor: pointer;
    padding: 10px;
    margin: 0;
    transition: color .3s, opacity .3s;
  }
  .fm-delete:hover {
    color: var(--fm-color);
  }
</style>
