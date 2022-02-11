<script>
  import IconSearch from '../icons/IconSearch.svelte'
  import {searchQuery, folder} from '../../store'

  folder.subscribe(() => {
    $searchQuery = ''
  })
</script>

<template>
  <form class="search">
    <input
            bind:value={$searchQuery}
            type="search"
            name="search"
            placeholder="e.g. image.png"
    />
    <button title="Search">
      <IconSearch />
    </button>
  </form>
</template>

<style>
  .search {
    position: relative;
  }

  .search input {
    border: 1px solid var(--fm-inputBorder);
    border-radius: 6px;
    height: 48px;
    padding: 0 48px 0 16px;
    font-size: inherit;
    width: 100%;
  }

  .search input::placeholder {
     color: var(--fm-color);
     opacity: .3;
   }

  .search button {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 0 16px;
    color: var(--fm-inputBorder);
    transition: .3s color;
    background-color: transparent;
    border: none;
  }

  .search button:hover {
    color: var(--fm-color)
  }

  .search input:focus
  {
    outline: none;
    border: solid 1px var(--fm-contrast);
    box-shadow: 0 0 0 3px var(--fm-contrastTransparent);
  }
</style>
