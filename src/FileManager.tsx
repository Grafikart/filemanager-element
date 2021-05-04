import { FileManagerContextProvider } from "./FileManagerContext";
import { FoldersList } from "./ui/FoldersList";
import { FilesList } from "./ui/FilesList";
import { FetchContextProvider } from "./hooks/useFetch";

export function FileManager({ endpoint }: { endpoint: string }) {
    return (
        <FetchContextProvider baseUrl={endpoint}>
            <FileManagerContextProvider endpoint={endpoint}>
                <div class="fm-modalOverlay fm-filemanager">
                    <div class="fm-modal">
                        <aside>
                            <FoldersList />
                        </aside>
                        <main>
                            <FilesList />
                        </main>
                    </div>
                </div>
            </FileManagerContextProvider>
        </FetchContextProvider>
    );
}
