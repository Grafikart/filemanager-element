declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        ondropzoneover?: () => void
        ondropzoneleave?: () => void
        onoutclick?: (e: MouseEvent) => void
    }
}