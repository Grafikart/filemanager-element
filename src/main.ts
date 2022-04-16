import { FileManager } from "./FileManager";
import type { Folder, File as FileType } from "./types";

function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

FileManager.register();
FileManager.register("fn-file-manager", {
  getFiles(folder: Folder) {
    const seed = between(0, 500);
    return Promise.resolve(
      [...Array(10).keys()].map((i) => {
        const url = `https://picsum.photos/id/${seed + i}`;
        return {
          id: (folder?.name || "") + i,
          name: `${folder?.name || ""}_File${i}.jpg`,
          url: url + "/1024/768",
          size: Math.random() * 100,
          folder: folder.id || "",
          thumbnail: url + "/100/100",
        };
      })
    );
  },
  getFolders(parent: Folder) {
    return Promise.resolve(
      [...Array(10).keys()].map((i) => {
        return {
          id: `Folder${i}`,
          name: `Folder${i}`,
          parent: null,
        };
      })
    );
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
    const url = `https://picsum.photos/id/${between(0, 500)}`;
    return Promise.resolve({
      id: folder?.name || "",
      name: `${folder?.name || ""}_UploadedFile.jpg`,
      url: url + "/1024/768",
      size: Math.random() * 100,
      folder: "",
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
