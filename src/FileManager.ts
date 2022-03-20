import FileManagerComponent from "./FileManager.svelte";
import config from "./config";
import { setLang } from "./lang";

export class FileManager extends HTMLElement {
  private fm: FileManagerComponent | null = null;

  static get observedAttributes() {
    return ["hidden", "endpoint"];
  }

  connectedCallback() {
    this.style.setProperty("display", "block");
    config.endpoint = this.getAttribute("endpoint")!;
    if (!config.endpoint) {
      throw new Error("You must define an endpoint for this custom element");
    }
    setLang(document.documentElement.getAttribute("lang") || "en");
    this.fm = new FileManagerComponent({
      target: this,
      props: {
        hidden: this.hidden,
        layout: this.getAttribute("layout") || "grid",
        lazyFolders: this.hasAttribute("lazy-folders"),
      },
    });
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === "hidden" && this.fm) {
      this.fm.$set({ hidden: newValue !== null });
    }
    if (name === "endpoint") {
      config.endpoint = newValue;
    }
  }

  disconnectedCallback() {
    this?.fm?.$destroy();
  }

  static define(name = "file-manager") {
    customElements.define(name, FileManager);
  }
}
