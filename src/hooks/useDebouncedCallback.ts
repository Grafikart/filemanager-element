import { useRef } from "preact/hooks";
import { debounce } from "../functions/time";

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const debouncedRef = useRef<(...args: Parameters<T>) => void>(
    debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay)
  );

  return debouncedRef.current;
}
