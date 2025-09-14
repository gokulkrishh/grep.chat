import { FileIcon, XIcon } from "../icons"
import { Button } from "../ui/button"

type Props = {
  files: File[]
  handleRemoveFile: (index: number) => void
}

export default function ChatFiles({ files, handleRemoveFile }: Props) {
  if (!files.length) {
    return null
  }

  return (
    <div className="flex flex-row flex-wrap gap-2 p-1">
      {files.map((file, index) => (
        <div
          className="bg-muted/50 border-input flex flex-row flex-wrap items-center justify-between gap-2 rounded-lg border py-1 pr-1 pl-2"
          key={file.name}
        >
          <div className="flex items-center gap-2">
            <FileIcon className="text-muted-foreground size-4" />
            <span title={file.name} className="max-w-40 truncate text-sm">
              {file.name}
            </span>
          </div>

          <Button
            className="size-6 rounded-full"
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveFile(index)}
          >
            <XIcon className="text-muted-foreground size-3.5 shrink-0" />
          </Button>
        </div>
      ))}
    </div>
  )
}
