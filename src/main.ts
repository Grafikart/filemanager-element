import { FileManager } from "./FileManager";
import type { Folder, File as FileType } from "./types";
import { filesResponse, foldersResponse } from "../tests/mockApi";

/**
 * This code is for demo / test purpose, it's not used for the library
 */
FileManager.register();
FileManager.register("fn-file-manager", {
  getFiles(folder?: Folder | null) {
    if (folder?.name === "Empty") {
      return Promise.resolve([]);
    }
    return Promise.resolve(filesResponse(15, folder?.id));
  },
  getFolders(parent?: Folder | null) {
    return Promise.resolve(foldersResponse(10, parent?.id));
  },
  createFolder(params: Pick<Folder, "parent" | "name">) {
    return Promise.resolve({
      id: `Folder${Date.now()}`,
      name: params.name,
      parent: params.parent,
    });
  },
  deleteFile(file: FileType) {
    return Promise.resolve();
  },
  deleteFolder(folder: Folder) {
    return Promise.resolve();
  },
  uploadFile(file: File, folder: Folder) {
    const url = `https://picsum.photos`;
    return Promise.resolve({
      id: folder?.name || "",
      name: `new_file.png`,
      url: url + "/1024/768",
      size: Math.random() * 100,
      folder: 1,
      thumbnail: url + "/100/100",
    });
  },
});

const apiBasedManager = document.querySelector("file-manager")!;
const fnBasedManager = document.querySelector("fn-file-manager")!;
[apiBasedManager, fnBasedManager].forEach((el) =>
  el.addEventListener("close", (e) => {
    (e.currentTarget as HTMLElement).setAttribute("hidden", "");
  })
);

apiBasedManager.addEventListener("selectfile", ((e: CustomEvent) => {
  console.log("fileselect", e.detail);
}) as EventListener);

document.querySelector("#api")!.addEventListener("click", () => {
  apiBasedManager.removeAttribute("hidden");
});

document.querySelector("#function")!.addEventListener("click", () => {
  fnBasedManager.removeAttribute("hidden");
});

if (window.location.hash === "#function") {
  fnBasedManager.removeAttribute("hidden");
} else if (window.location.hash === "#readonly") {
  document.querySelector("[readonly]")!.removeAttribute("hidden");
} else {
  apiBasedManager.removeAttribute("hidden");
}
