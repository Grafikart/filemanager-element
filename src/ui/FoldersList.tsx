import { useFileManagerContext } from "../FileManagerContext";
import type { Folder, ID } from "../types";
import { IconArrow, IconFolder, IconLoader } from "../components/icons";
import clsx from "clsx";
import { useRef, useState } from "preact/hooks";
import { useDragOver } from "../hooks/useDragOver";

export function FoldersList() {
  const { folders } = useFileManagerContext();
  return <Folders folders={folders} parent={null} />;
}

type FoldersProps = {
  folders: Folder[];
  parent: ID | null;
};

function Folders({ folders, parent }: FoldersProps) {
  const currentFolders = folders.filter((f) => f.parent === parent);

  return (
    <ul class="fm-folders">
      {currentFolders.map((folder) => (
        <FolderItem key={folder.id} folders={folders} folder={folder} />
      ))}
    </ul>
  );
}

function FolderItem({
  folder,
  folders,
}: {
  folder: Folder;
  folders: Folder[];
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);
  const {
    currentFolder,
    setCurrentFolder,
    uploadFiles,
  } = useFileManagerContext();
  const toggle = () => {
    setCurrentFolder(folder.id);
    setOpen((n) => !n);
  };
  const children = folders.filter((f) => f.parent === folder.id);
  const loading = folder.hasChildren && children.length === 0;

  const isDragOver = useDragOver(ref, (files) => {
    uploadFiles(files, folder.id);
  });

  return (
    <li key={folder.id} ref={ref}>
      <span
        onClick={toggle}
        class={clsx("fm-folder", {
          "is-open": open && folder.hasChildren,
          "is-current": isDragOver || folder.id === currentFolder,
        })}
      >
        <IconArrow
          class={clsx("fm-iconArrow", !folder.hasChildren && "fm-hidden")}
        />
        {loading && open ? (
          <IconLoader size={20} />
        ) : (
          <IconFolder class="fm-iconFolder" />
        )}
        <span className="fm-folderName">{folder.name}</span>
      </span>
      {folder.hasChildren && open && (
        <Folders folders={folders} parent={folder.id} />
      )}
    </li>
  );
}
