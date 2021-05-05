import { Props } from "../types";
import { useRef } from "preact/hooks";
import { useDragOver } from "../hooks/useDragOver";
import clsx from "clsx";
import { useFileManagerContext } from "../FileManagerContext";
import { IconUpload } from "../components/icons";

export function Dropzone({
  as: Component = "div",
  children,
  class: className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { uploadFiles, currentFolder } = useFileManagerContext();
  const isDragOver = useDragOver(ref, (files) => {
    uploadFiles(files, currentFolder ?? "");
  });

  return (
    <Component class={clsx(className, isDragOver && "is-dragover")} ref={ref}>
      {children}
      <span class="fm-dropzone">
        <IconUpload />
      </span>
    </Component>
  );
}
