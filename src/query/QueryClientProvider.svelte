<template>
  <slot></slot>
</template>

<script lang="ts">
  import {QueryClient, contextKey} from './index'
  import {setContext} from 'svelte'

  export let client: QueryClient;
  setContext(contextKey, client)
</script>
