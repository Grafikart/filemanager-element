import FileManagerComponent from "./FileManager.svelte";
import { setLang } from "./lang";
import type { Options } from "./types";
import config from "./config";

export class FileManager {
  private fm: FileManagerComponent | null = null;
  static registered = new Map();
  private options: Options;

  constructor(private element: HTMLElement, options: Partial<Options> = {}) {
    this.options = { ...config, ...options };
  }

  static get observedAttributes() {
    return ["hidden", "endpoint"];
  }

  connectedCallback() {
    this.element.style.setProperty("display", "block");
    const endpointAttr = this.element.getAttribute("endpoint");
    if (endpointAttr) {
      this.options.endpoint = endpointAttr!;
    }
    this.options.readOnly = this.element.hasAttribute("readonly");

    if (!this.options.endpoint && !this.options.getFiles) {
      throw new Error("You must define an endpoint for this custom element");
    }

    setLang(document.documentElement.getAttribute("lang") || "en");
    this.fm = new FileManagerComponent({
      target: this.element,
      props: {
        hidden: this.element.hidden,
        layout: this.element.getAttribute("layout") || "grid",
        lazyFolders: this.element.hasAttribute("lazy-folders"),
        options: this.options,
      },
    });
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === "hidden" && this.fm) {
      this.fm.$set({ hidden: newValue !== null });
    }
    if (name === "endpoint") {
      this.options.endpoint = newValue;
    }
  }

  disconnectedCallback() {
    this?.fm?.$destroy();
  }

  static register(name = "file-manager", options?: Partial<Options>) {
    if (!this.registered.has(name)) {
      // A class cannot be used multiple time to declare a custom element so we need to creates
      // a fresh class for every "register" call
      class AnonymousFileManager extends HTMLElement {
        private decorated: FileManager;

        constructor() {
          super();
          this.decorated = new FileManager(this, options);
        }

        static get observedAttributes() {
          return FileManager.observedAttributes;
        }

        connectedCallback() {
          return this.decorated.connectedCallback();
        }

        attributeChangedCallback(name: string, oldValue: any, newValue: any) {
          return this.decorated.attributeChangedCallback(
            name,
            oldValue,
            newValue
          );
        }
      }

      customElements.define(name, AnonymousFileManager);
      this.registered.set(name, true);
    }
  }
}
