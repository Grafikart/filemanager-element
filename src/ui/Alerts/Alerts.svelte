<template>
  <div class="fm-wrapper">
    {#each $flashMessages as message}
      <div  transition:fly={{x: 20}}>
        <Alert message={message}/>
      </div>
    {/each}
  </div>
</template>

<script>
  import { fly } from 'svelte/transition'
  import Alert from './Alert.svelte'
  import {flashMessages} from '../../store'
</script>

<style>
  .fm-wrapper {
    position: absolute;
    top: .5em;
    right: .5em;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: .5em;
  }
</style>
