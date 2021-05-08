import { FileManagerContextProvider } from "./FileManagerContext";
import { FoldersList } from "./ui/FoldersList";
import { FilesList } from "./ui/FilesList";
import { FetchContextProvider } from "./hooks/useFetch";
import { Dropzone } from "./ui/Dropzone";
import { SearchField } from "./ui/SearchField";

export function FileManager({ endpoint }: { endpoint: string }) {
  return (
    <FetchContextProvider baseUrl={endpoint}>
      <FileManagerContextProvider>
        <div class="fm-modalOverlay fm-filemanager">
          <div class="fm-modal">
            <aside class="fm-sidebar">
              <SearchField />
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
