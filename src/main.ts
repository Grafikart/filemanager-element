import FileManager from './FileManager.svelte'
import config from './config'

config.endpoint = 'http://kumquat.localhost/api/fm'

const app = new FileManager({
  target: document.getElementById('app'),
})

export default app
