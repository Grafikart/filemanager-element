<template>
  <tr class:loading on:click={handleRowClick} bind:this={row}>
    <td></td>
    <td>
      <img src={file.thumbnail} alt=""/>
    </td>
    <td class="filename">{file.name}</td>
    <td>{sizeFormatter.format(file.size / 1000)}</td>
    <td>
      <button on:click|preventDefault|stopPropagation={handleDelete} disabled={loading}>
        <IconDelete/>
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
  import type { File } from '../types'
  import IconDelete from './icons/IconDelete.svelte'
  import { useQueryClient } from '@sveltestack/svelte-query'
  import { removeFile } from '../store'

  let row: HTMLTableRowElement
  const queryClient = useQueryClient()
  const sizeFormatter = new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit: 'kilobyte',
    unitDisplay: 'short',
    maximumSignificantDigits: 3
  });
  const loading = false
  const handleDelete = () => {
    if (!confirm('Voulez vous vraiment supprimer ce fichier ?')) {
      return;
    }
    removeFile(queryClient, file);
  }
  const handleRowClick = () => {
    row.dispatchEvent(new CustomEvent('selectfile', { detail: file, bubbles: true }))
  }
  export let file: File
</script>

<style>
  .loading {
    opacity: .3;
    animation: fmFadeRow infinite linear 2s .5s;
    pointer-events: none;
  }

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
    filter: drop-shadow(0px 1px 4px rgba(16, 43, 107, 0.6));
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
</style>
