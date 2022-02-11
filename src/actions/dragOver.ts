import { $on } from '../functions/dom'

export function dragOver(node: HTMLElement) {
  const offPreventListeners = $on(
    node,
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
    })

  const offOver = $on(node, ["dragover", "dragenter"], function () {
    node.dispatchEvent(new CustomEvent("dropzoneover"))
  });
  const offLeave = $on(
    node,
    ["dragleave", "dragend", "drop"],
    function () {
      node.dispatchEvent(new CustomEvent("dropzoneleave"))
    }
  );

  return {
    destroy() {
      offPreventListeners();
      offOver();
      offLeave();
    }
  };
}
