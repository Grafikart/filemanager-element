import { IconLoader, IconSearch } from "../components/icons";
import { useFileManagerContext } from "../FileManagerContext";
import { useEffect, useRef } from "preact/hooks";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

export function SearchField() {
  const ref = useRef<HTMLInputElement>();
  const { search, setSearch, fileLoading } = useFileManagerContext();

  const onInput = useDebouncedCallback(
    (e: Event) => setSearch((e.target as HTMLInputElement).value || ""),
    500
  );
  const isLoading = search !== "" && fileLoading;

  useEffect(() => {
    if (search === "") {
      ref.current.value = "";
    }
  }, [search]);

  return (
    <form class="fm-searchField">
      <input
        ref={ref}
        onInput={onInput}
        type="search"
        name="search"
        placeholder="e.g. image.png"
      />
      <button title="Search" disabled={isLoading}>
        {isLoading ? <IconLoader size={14} /> : <IconSearch />}
      </button>
    </form>
  );
}
