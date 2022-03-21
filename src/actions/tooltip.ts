export function tooltip(node: HTMLElement, title: string) {
  const onMouveOver = () => {
    const rect = node.getBoundingClientRect();
    console.log("over");

    // Create the tooltip
    const tooltip = document.createElement("div");
    tooltip.classList.add("fm-tooltip");
    tooltip.innerText = title;
    const root = node.closest(".fm-root")!;
    root.appendChild(tooltip);

    // Find the tooltip placement
    tooltip.style.setProperty(
      "transform",
      `translate(calc(${rect.left + rect.width / 2}px - 50%), calc(${
        rect.top - 4
      }px - 100%))`
    );
    // Fade the element
    tooltip.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      easing: "ease-in-out",
    });

    node.addEventListener(
      "pointerleave",
      () => {
        tooltip.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 200,
          easing: "ease-in-out",
        });
        window.setTimeout(() => {
          tooltip.remove();
        }, 200);
      },
      { once: true }
    );
  };
  node.addEventListener("pointerenter", onMouveOver);

  return {
    destroy() {
      node.removeEventListener("pointerenter", onMouveOver);
    },
  };
}
