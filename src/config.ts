import type { Folder, File as FileType } from "./types";
import { fetchApi } from "./functions/api";

const config = {
  endpoint: "",
  readOnly: false,
  getFolders(parent?: Folder): Promise<Folder[]> {
    return fetchApi(this.endpoint, "/folders", {
      query: {
        parent: parent?.id?.toString(),
      },
    });
  },

  createFolder(params: Pick<Folder, "name" | "parent">): Promise<Folder> {
    return fetchApi(this.endpoint, "/folders", {
      method: "post",
      json: params,
    });
  },

  deleteFolder(folder: Folder): Promise<void> {
    return fetchApi(this.endpoint, "/folders/{id}", {
      method: "delete",
      params: {
        id: folder.id!.toString(),
      },
    });
  },
  getFiles(folder?: Folder): Promise<FileType[]> {
    return fetchApi(this.endpoint, "/files", {
      query: {
        folder: folder?.id ? folder.id.toString() : undefined,
      },
    });
  },
  uploadFile(file: File, folder?: Folder): Promise<FileType> {
    const form = new FormData();
    form.set("file", file);
    if (folder?.id) {
      form.set("folder", folder.id.toString());
    }
    return fetchApi(this.endpoint, "/files", {
      method: "post",
      body: form,
    });
  },
  deleteFile(file: FileType): Promise<void> {
    return fetchApi(this.endpoint, `/files/{id}`, {
      method: "delete",
      params: {
        id: file.id.toString(),
      },
    });
  },
};

export default config;
