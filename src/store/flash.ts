import { writable } from 'svelte/store'
import type { FlashMessage } from '../types'

export const flashMessages = writable<FlashMessage[]>([])

export const flash = (message: string, type: FlashMessage['type'] = 'success') => {
  const id = Date.now()
  flashMessages.update(messages => [{type, message, id}, ...messages])
  if (type === 'success') {
    window.setTimeout(() => {
      flashMessages.update(messages => messages.filter(message => message.id !== id))
    }, 2000)
  }
}

export const deleteFlashMessage = (id: FlashMessage['id']) => {
  flashMessages.update(messages => messages.filter(message => message.id !== id))
}

