import { useFileManagerContext } from "../FileManagerContext";
import { useFetch } from "../hooks/useFetch";
import { File } from "../types";
import { IconDelete } from "../components/icons";
import { useState } from "preact/hooks";
import { fetchApi } from "../functions/api";

export function FilesList() {
    const { files, deleteFile } = useFileManagerContext();

    return (
        <table class="fm-filesList">
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {files.map((file) => (
                    <FileRow onDelete={deleteFile} file={file} />
                ))}
            </tbody>
        </table>
    );
}

const sizeFormatter = new Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "kilobyte",
    unitDisplay: "short",
    maximumSignificantDigits: 3,
});

type FileRowProps = { file: File; onDelete: (file: File) => Promise<any> };

function FileRow({ file, onDelete }: FileRowProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const onClick = () => {
        setLoading(true);
        onDelete(file).finally(() => setLoading(false));
    };
    return (
        <tr class={loading ? "fm-isLoading" : ""}>
            <td></td>
            <td>
                <img src={file.thumbnail} alt="" />
            </td>
            <td>{file.name}</td>
            <td>{sizeFormatter.format(file.size / 1000)}</td>
            <td>
                <button onClick={onClick} disabled={loading}>
                    <IconDelete />
                </button>
            </td>
        </tr>
    );
}
