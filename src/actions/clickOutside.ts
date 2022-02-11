export function clickOutside(node: HTMLElement, eventName = 'outclick') {
  const handleClick = (event) => {
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent(eventName, {bubbles: eventName  !== 'outclick'}));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
