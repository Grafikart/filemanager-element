import { render } from 'preact'
import { FileManager } from './FileManager'
import './index.css'

class FileManagerElement extends HTMLElement {

    connectedCallback () {
        render(<FileManager endpoint={this.getAttribute('endpoint')} />, this)
    }

}

customElements.define('file-manager', FileManagerElement);
