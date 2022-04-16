import type { Folder } from "../types";

/**
 * Add a new "children" property using the "parent" property
 * to create a tree instead of a flat list
 */
export function nestFolder(originalFolders: Folder[]): Folder[] {
  // Avoid mutating the original array, clone all the children
  const folders = originalFolders.map((folder) => ({
    ...folder,
    children: [],
  }));
  // Creates a map to find folder faster during the next loop
  const foldersById = folders.reduce(
    (acc, folder) => acc.set(folder.id, folder),
    new Map()
  );
  // Generate a children property for every folders
  for (const folder of folders) {
    const parent = foldersById.get(folder.parent);
    if (folder.parent && parent) {
      parent.children = parent.children
        ? [...parent.children, folder]
        : [folder];
    }
  }
  return folders;
}
