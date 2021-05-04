import { useCallback, useMemo, useState } from "preact/hooks";

export function useToggle(initial: boolean): [boolean, () => void] {
    const [state, setState] = useState(initial);
    const toggle = useCallback(() => {
        setState((n) => !n);
    }, [setState]);
    return [state, toggle];
}
