import type { Folder, File as FileType } from "./types";
import { fetchApi } from "./functions/api";

const config = {
  endpoint: "",
  readOnly: false,
  httpHeaders: {},
  getFolders(parent?: Folder | null): Promise<Folder[]> {
    return fetchApi(this.endpoint, "/folders", {
      query: {
        parent: parent?.id?.toString(),
      },
      headers: this.httpHeaders,
    });
  },

  createFolder(params: {
    name: Folder["name"];
    parent?: Folder["parent"];
  }): Promise<Folder> {
    return fetchApi(this.endpoint, "/folders", {
      method: "post",
      headers: this.httpHeaders,
      json: params,
    });
  },

  deleteFolder(folder: Folder): Promise<void> {
    return fetchApi(this.endpoint, "/folders/{id}", {
      method: "delete",
      headers: this.httpHeaders,
      params: {
        id: folder.id!.toString(),
      },
    });
  },
  getFiles(folder?: Folder | null): Promise<FileType[]> {
    return fetchApi(this.endpoint, "/files", {
      headers: this.httpHeaders,
      query: {
        folder: folder?.id ? folder.id.toString() : undefined,
      },
    });
  },
  uploadFile(file: File, folder?: Folder | null): Promise<FileType> {
    const form = new FormData();
    form.set("file", file);
    if (folder?.id) {
      form.set("folder", folder.id.toString());
    }
    return fetchApi(this.endpoint, "/files", {
      method: "post",
      headers: this.httpHeaders,
      body: form,
    });
  },
  deleteFile(file: FileType): Promise<void> {
    return fetchApi(this.endpoint, `/files/{id}`, {
      method: "delete",
      headers: this.httpHeaders,
      params: {
        id: file.id.toString(),
      },
    });
  },
};

export default config;
