import { render } from "preact";
import { FileManager } from "./FileManager";
import "./css/main.scss";

class FileManagerElement extends HTMLElement {
  connectedCallback() {
    render(
      <FileManager endpoint={this.getAttribute("endpoint") ?? ""} />,
      this
    );
  }
}

customElements.define("file-manager", FileManagerElement);
