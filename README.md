# file-manager custom element

[![npm](https://img.shields.io/npm/v/filemanager-element.svg)](http://npm.im/filemanager-element)
[![Test](https://github.com/Grafikart/FileManagerJS/actions/workflows/test.yml/badge.svg)](https://github.com/Grafikart/FileManagerJS/actions/workflows/test.yml)

![](./screenshot.jpg)

You want a simple file browser for your website, without the hassle of a front-end framework ? Here is a simple custom element for you.

First register the custom element

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
| layout       | Files layout "rows" or "grid"                               | grid    |
| lazy-folders | Should all folder be lazy loaded with a new call to the API | false   |
| hidden       | Work like the default HTML attribute                        | false   |

## Events

| Name         | Description                                        |
|--------------|----------------------------------------------------|
| close        | The user clicked on the overlay to close the modal |
| fileSelected | The use selected a file                            |
