import { writable } from "svelte/store";

/**
 * If the server is fast enough we don't want to show upload progress
 * this custom store push file with a delay to avoid showing progress bars for short upload time
 */
const delay = 300;
const uploadsDelayed = writable([] as File[]);
const timerMap = new Map();

export const uploads = {
  push(file: File) {
    const timer = setTimeout(() => {
      uploadsDelayed.update((files) => [file, ...files]);
    }, delay);
    timerMap.set(file, timer);
  },
  remove(file: File) {
    const timer = timerMap.get(file);
    if (timer !== undefined) {
      clearTimeout(timer);
      timerMap.delete(file);
    }
    uploadsDelayed.update((files) => files.filter((f) => f !== file));
  },
  subscribe: uploadsDelayed.subscribe,
};
