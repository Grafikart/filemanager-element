# file-manager custom element

[![npm](https://img.shields.io/npm/v/filemanager-element.svg)](http://npm.im/filemanager-element)
[![Test](https://github.com/Grafikart/FileManagerJS/actions/workflows/test.yml/badge.svg)](https://github.com/Grafikart/FileManagerJS/actions/workflows/test.yml)

![](./screenshot.jpg)

You want a simple file browser for your website, without the hassle of a front-end framework ? Here is a simple custom
element for you.

- [Demonstration (codesandbox.io)](https://km7mr7.csb.app)

First register the custom element (the lang is infered from the html "lang" attribute)

```js
import {FileManager} from 'filemanager-element'
import 'filemanager-element/FileManager.css'

FileManager.register();
```

Then you can simply use your custom element whenever you want

```html
<file-manager endpoint="http://your.api.com/endpoint"></file-manager>
```

You just have to implement the API following this [Open API specification](openapi.yml) and it will work out of the box.

To interface the editor with your system (for instance when a file is selected) you can simply bind listeners

```js
const filemanager = document.querySelector("file-manager");
filemanager.addEventListener("close", () => {
  console.log("close");
});

filemanager.addEventListener("selectfile", e => {
  console.log("fileSelected", e.detail);
});
```

## Attributes

| Attribute    | Description                                                 | Default |
|--------------|-------------------------------------------------------------|---------|
| endpoint     | The base url for the file and folder API                    |         |
| readonly     | Do not allow file deletion or creation                      | false   |
| layout       | Files layout "rows" or "grid"                               | grid    |
| lazy-folders | Should all folder be lazy loaded with a new call to the API | false   |
| hidden       | Work like the default HTML attribute                        | false   |

## Events

| Name        | Description                                        |
|-------------|----------------------------------------------------|
| close       | The user clicked on the overlay to close the modal |
| fileselect  | The use selected a file                            |

## Options

Options can be set on the `register()` method as a second argument. All the options are optional

| Name            | Type     | Description                                |
|-----------------|----------|--------------------------------------------|
| readOnly        | bool     | Do not allow file deletion or creation     |
| endpoint        | string   | Endpoint for the REST API                  |
| httpHeaders     | object   | Additional headers to send to the endpoint |
| getFiles()      | function | Custom API to retrieve files               |
| getFolders()    | function | Custom API to retrieve folders             |
| deleteFile()    | function | Custom API to delete file                  |
| deleteFolder()  | function | Custom API to delete folder                |
| uploadFile()    | function | Custom API to upload file                  |
| createFolder()  | function | Custom API to create folder                |

## Custom API

If you do not use a traditional REST API you can overwrite the method used to fetch the data.

```ts
import type {File as FileType, Folder} from 'filemanager-element'

FileManager.register('my-file-manager', {
  getFiles (folder?: Folder): Promise<FileType[]> {
  },
  getFolders (parent?: Folder): Promise<Folder> {
  },
  createFolder (params: Pick<Folder, "parent" | "name">): Promise<Folder> {
  },
  deleteFile (file: FileType): Promise<void> {
  },
  deleteFolder (folder: Folder): Promise<void> {
  },
  uploadFile (file: File, folder: Folder): Promise<Filetype> {
  }
})
```
