import { FileManager } from "./FileManager";

FileManager.register();
FileManager.register();

document.querySelector("file-manager")!.addEventListener("close", () => {
  console.log("close");
});

document.querySelector("file-manager")!.addEventListener("selectfile", ((
  e: CustomEvent
) => {
  console.log("fileselect", e.detail);
}) as EventListener);
