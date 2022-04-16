<template>
  <tr on:click={actions.handleClick} bind:this={row}>
    <td></td>
    <td>
      <img src={file.thumbnail} alt=""/>
    </td>
    <td class="filename">{filename}</td>
    <td>{file.size ? sizeFormatter.format(file.size / 1000) : null}</td>
    <td class="actions">
      <button use:tooltip={t("copy")} on:click|preventDefault|stopPropagation={actions.handleCopy}>
        <IconCopy/>
      </button>
      {#if !options.readOnly}
      <button use:tooltip={t("delete")} on:click|preventDefault|stopPropagation={actions.handleDelete}>
        <IconDelete/>
      </button>
      {/if}
    </td>
  </tr>
</template>

<script lang="ts">
  import type { File } from '../types'
  import IconDelete from './icons/IconDelete.svelte'
  import IconCopy from './icons/IconCopy.svelte'
  import { tooltip } from '../actions/tooltip'
  import { useFileActions } from '../hooks/useFileActions'
  import { shorten } from '../functions/string'
  import { t } from '../lang'
  import { getOptions } from '../store'

  let row: HTMLTableRowElement
  const options = getOptions()
  const sizeFormatter = new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit: 'kilobyte',
    unitDisplay: 'short',
    maximumSignificantDigits: 3
  } as any);
  export let file: File
  $: actions = useFileActions(file, row)
  $: filename = shorten(file.name, 35)
</script>

<style>
  @keyframes fmFadeRow {
    0% {
      opacity: .3
    }
    50% {
      opacity: .1
    }
    100% {
      opacity: .3
    }
  }

  tr {
    cursor: pointer;
  }

  tr:hover {
    background-color: var(--fm-backgroundDarken);
  }

  td:nth-child(3) {
    margin-left: 24px;
  }

  button {
    border: none;
    display: block;
    background: none;
    color: var(--fm-iconColor);
    cursor: pointer;
    padding: 10px;
    margin: 0;
    transition: color .3s;
  }

  button:hover {
    color: var(--fm-color);
  }

  img {
    display: block;
    max-width: 100%;
    width: 100%;
    max-height: 100px;
    object-fit: cover;
    filter: drop-shadow(0px 1px 4px rgba(16, 43, 107, 0.2));
    border-radius: 6px;
  }

  img[src$=".svg"] {
    object-fit: fill;
  }

  .filename {
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1rem;
  }

  .actions {
    flex: none;
    width: 72px;
    display: flex;
  }
</style>
