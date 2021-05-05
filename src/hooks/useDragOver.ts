import type { Ref } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { $on } from "../functions/dom";

type Callback = (e: FileList) => any;

export function useDragOver(
  ref: {
    current: HTMLElement | null;
  },
  cb: Callback
): boolean {
  const [state, setState] = useState<boolean>(false);
  const cbRef = useRef<Callback>(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    const offPreventListeners = $on(
      ref.current,
      [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop",
      ],
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    );

    const offOver = $on(ref.current, ["dragover", "dragenter"], function () {
      setState(true);
    });

    const offLeave = $on(
      ref.current,
      ["dragleave", "dragend", "drop"],
      function () {
        setState(false);
      }
    );

    const offDrop = $on(ref.current, ["drop"], (e) => {
      cbRef.current((e as DragEvent).dataTransfer!.files);
    });

    return () => {
      offPreventListeners();
      offOver();
      offLeave();
      offDrop();
    };
  });

  return state;
}
