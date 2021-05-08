export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number | undefined;
  return function (...args: Parameters<T>[]) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback(...args);
    }, delay);
  };
}
