import { FileManagerContextProvider } from "./FileManagerContext";
import { FoldersList } from "./ui/FoldersList";
import { FilesList } from "./ui/FilesList";
import { FetchContextProvider } from "./hooks/useFetch";
import { Dropzone } from "./ui/Dropzone";

export function FileManager({ endpoint }: { endpoint: string }) {
  return (
    <FetchContextProvider baseUrl={endpoint}>
      <FileManagerContextProvider endpoint={endpoint}>
        <div class="fm-modalOverlay fm-filemanager">
          <div class="fm-modal">
            <aside>
              <FoldersList />
            </aside>
            <Dropzone as="main">
              <FilesList />
            </Dropzone>
          </div>
        </div>
      </FileManagerContextProvider>
    </FetchContextProvider>
  );
}
