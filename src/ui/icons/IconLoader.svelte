<template>
  <div class={`loader ${$$props.class}`} style={`--size:${size}px`} />
</template>

<script lang="ts">
  export let size: number = 20
</script>

<style>
  .loader {
    --size: 20px;
    width: var(--size);
    height: var(--size);
    border-radius: var(--size);
    border-top: 2px solid currentColor;
    will-change: transform;
    animation: fmLoaderAnimation 1s infinite linear;
  }

  @keyframes fmLoaderAnimation {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
</style>
