import type { File } from '../types'
import { useQueryClient } from '@sveltestack/svelte-query'
import { flash, removeFile } from '../store'

export function useFileActions (file: File, element: HTMLElement) {
  const queryClient = useQueryClient()
  const handleDelete = () => {
    if (!confirm('Voulez vous vraiment supprimer ce fichier ?')) {
      return;
    }
    removeFile(queryClient, file);
  }
  const handleClick = () => {
    element.dispatchEvent(new CustomEvent('selectfile', { detail: file, bubbles: true }))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(file.url)
    flash('Le lien a été copié dans votre presse papier')
  }

  return {
    handleClick,
    handleCopy,
    handleDelete
  }
}
