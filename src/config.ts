import type { Folder, File as FileType } from "./types";
import { fetchApi } from "./functions/api";

const config = {
  endpoint: "",
  readOnly: false,
  getFolders(parent?: Folder) {
    return fetchApi(config.endpoint, "/folders", {
      query: {
        parent: parent?.id?.toString(),
      },
    });
  },

  createFolder(params: Pick<Folder, "name" | "parent">) {
    return fetchApi(config.endpoint, "/folders", {
      method: "post",
      json: params,
    });
  },

  deleteFolder(folder: Folder) {
    return fetchApi(config.endpoint, "/folders/{id}", {
      method: "delete",
      params: {
        id: folder.id!.toString(),
      },
    });
  },
  getFiles(folder?: Folder) {
    return fetchApi(config.endpoint, "/files", {
      query: {
        folder: folder?.id ? folder.id.toString() : undefined,
      },
    });
  },
  uploadFile(file: File, folder?: Folder) {
    const form = new FormData();
    form.set("file", file);
    if (folder?.id) {
      form.set("folder", folder.id.toString());
    }
    return fetchApi(config.endpoint, "/files", {
      method: "post",
      body: form,
    });
  },
  deleteFile(file: FileType) {
    return fetchApi(config.endpoint, `/files/{id}`, {
      method: "delete",
      params: {
        id: file.id.toString(),
      },
    });
  },
};

export default config;
