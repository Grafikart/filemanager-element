<template>
  {#if $uploads.length > 0}
    <aside class="fm-upload-progress">
      {#each $uploads as file}
        <div transition:fly={{x: 20}}>
          <div class="fm-upload-progress-item">
            {file.name}
            <div class="fm-upload-progress-bar"></div>
          </div>
        </div>
      {/each}
    </aside>
  {/if}
</template>

<script>
  import {fly} from 'svelte/transition'
  import {uploads} from '../../store'
</script>

<style>
  .fm-upload-progress {
    z-index: 2;
    background-color: var(--fm-background);
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    box-shadow: var(--fm-shadow);
    border: 1px solid var(--fm-border);
    width: 200px;
    border-radius: 4px;
  }

  .fm-upload-progress-item {
    font-size: .9rem;
    border-bottom: 1px solid var(--fm-border);
    padding: 1em;
  }

  .fm-upload-progress-bar {
    margin-top: .4rem;
    position: relative;
    height: 5px;
    background-color: var(--fm-border);
    overflow: hidden;
    border-radius: 5px;
  }

  .fm-upload-progress-bar::before {
    content: '';
    width: 25%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-radius: 5px;
    background: var(--fm-contrast);
    animation: FMProgressIndicator infinite 1s linear;
  }

  @keyframes FMProgressIndicator {
    from {
      transform: translateX(-100%)
    }
    to {
      transform: translateX(200px)
    }
  }
</style>
