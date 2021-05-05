export function $on(
  el: HTMLElement,
  eventNames: string[],
  cb: (e: Event) => any
) {
  eventNames.forEach((eventName) => {
    el.addEventListener(eventName, cb);
  });

  return () => {
    eventNames.forEach((eventName) => {
      el.removeEventListener(eventName, cb);
    });
  };
}
