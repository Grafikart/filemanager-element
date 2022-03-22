<template>
  <div class="fm-alert" class:fm-danger={message.type === 'danger'} class:fm-success={message.type === 'success'}>
    {#if message.type === 'danger'}
      <IconCircleExclamation />
    {:else if message.type === 'success'}
      <IconCircleCheck />
      <div class="fm-progress"></div>
    {/if}
    {message.message}
    <button class="fm-close" on:click|preventDefault={handleClose}>&times;</button>
  </div>
</template>

<script lang="ts">
  import IconCircleExclamation from '../icons/IconCircleExclamation.svelte'
  import IconCircleCheck from '../icons/IconCircleCheck.svelte'
  import type { FlashMessage } from '../../types'
  import { deleteFlashMessage } from '../../store'

  export let message: FlashMessage

  const handleClose = () => {
    deleteFlashMessage(message.id)
  }
</script>

<style>
  .fm-alert {
    background-color: #fff;
    padding:.8em 1em;
    width: 250px;
    display: flex;
    align-items: center;
    animation: alertIn 0.5s both;
    line-height: 1.2;
    position: relative;
    font-size: .9em;
    border: 1px solid var(--fm-border);
    border-bottom: 3px solid var(--fm-border);
    color: var(--fm-color);

    background: var(--fm-background);
    box-shadow: 0 2px 4px var(--fm-shadow);
    border-radius: 3px;
    transition: 0.3s;
  }
  .fm-alert.fm-danger {
    border-bottom-color: var(--fm-red);
    color: var(--fm-red-dark)
  }
  .fm-alert :global(svg) {
    flex: none;
    margin-right: .5em;
  }
  .fm-alert.fm-danger :global(svg) {
    color: var(--fm-red);
  }
  .fm-alert.fm-success {
    color: var(--fm-green-dark);
    border-bottom-color: var(--fm-green);
  }
  .fm-alert.fm-success :global(svg) {
    color: var(--fm-green);
  }
  .fm-progress {
    height: 3px;
    background: var(--fm-border);
    position: absolute;
    bottom: -3px;
    right: 0;
    width: 100%;
    z-index: 3;
    transform-origin: 0 100%;
    animation: fmAlertDuration 2s linear both;
  }
  @keyframes fmAlertDuration {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  .fm-close {
    margin-right: -.5em;
    width: 2em;
    height: 100%;
    flex: none;
    margin-left: auto;
    color: var(--fm-color);
    opacity: 0.3;
    cursor: pointer;
    transition: opacity 0.3s;
    background: transparent;
    font-size: 1rem;
    padding: 0;
    border: none;
  }
  .fm-close:hover {
    opacity: .5;
  }
</style>
