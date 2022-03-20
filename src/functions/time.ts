export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function (...args: Parameters<T>[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      callback(...args);
    }, delay);
  };
}
