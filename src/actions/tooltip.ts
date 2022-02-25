import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export function tooltip(node: HTMLElement, title: string) {

  const t = tippy(node, {
    content: title,
  });

  return {
    destroy() {
      t.destroy()
    },
  };
}
