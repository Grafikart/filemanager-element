<template>
  <button {...$$props}>
    <slot/>
  </button>
</template>

<style>
  button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
</style>
