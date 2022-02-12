import FileManagerComponent from './FileManager.svelte'
import config from './config'

export class FileManager extends HTMLElement {
  private fm: FileManagerComponent | null = null

  static get observedAttributes() { return ['hidden']; }

  connectedCallback() {
    this.style.setProperty('display', 'block')
    config.endpoint = this.getAttribute('endpoint')!
    if (!config.endpoint) {
      throw new Error('You must define an endpoint for this custom element')
    }
    this.fm = new FileManagerComponent({
      target: this,
      props: {
        hidden: this.hidden
      }
    })
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'hidden' && this.fm) {
      this.fm.$set({ hidden: newValue !== null })
    }
  }

  disconnectedCallback() {
    this?.fm?.$destroy()
  }

  static define(name = 'file-manager') {
    customElements.define(name, FileManager)
  }
}


