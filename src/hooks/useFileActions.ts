import type { File } from "../types";
import { useQueryClient } from "../query";
import { flash, getOptions, removeFile } from "../store";
import { t } from "../lang";

export function useFileActions(file: File, element: HTMLElement) {
  const queryClient = useQueryClient();
  const options = getOptions();
  const handleDelete = () => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }
    removeFile(options, queryClient, file);
  };
  const handleClick = () => {
    element.dispatchEvent(
      new CustomEvent("selectfile", { detail: file, bubbles: true })
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(file.url);
    flash("Le lien a été copié dans votre presse papier");
  };

  return {
    handleClick,
    handleCopy,
    handleDelete,
  };
}
