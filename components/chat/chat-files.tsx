import { useEffect, useState } from "react"

import { FileIcon, XIcon } from "../icons"
import { Button } from "../ui/button"

type Props = {
  files: File[]
  handleRemoveFile: (index: number) => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/")
}

const FilePreview = ({
  file,
  index,
  onRemove,
}: {
  file: File
  index: number
  onRemove: (index: number) => void
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isImageFile(file)) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <div
      className="bg-muted/50 border-input flex flex-row items-center gap-2 rounded-lg border py-1 pr-1 pl-2"
      key={`${file.name}-${index}`}
    >
      {previewUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element -- blob: URLs are local previews, not optimizable by next/image */
        <img src={previewUrl} alt={file.name} className="size-8 shrink-0 rounded object-cover" />
      ) : (
        <FileIcon className="text-muted-foreground size-4 shrink-0" />
      )}

      <div className="flex flex-col">
        <span title={file.name} className="max-w-40 truncate text-sm leading-tight">
          {file.name}
        </span>
        <span className="text-muted-foreground text-xs leading-tight">
          {formatFileSize(file.size)}
        </span>
      </div>

      <Button
        className="size-6 shrink-0 rounded-full"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        aria-label={`Remove ${file.name}`}
      >
        <XIcon className="text-muted-foreground size-3.5 shrink-0" />
      </Button>
    </div>
  )
}

export default function ChatFiles({ files, handleRemoveFile }: Props) {
  if (!files.length) {
    return null
  }

  return (
    <div className="flex flex-row flex-wrap gap-2 p-1">
      {files.map((file, index) => (
        <FilePreview
          key={`${file.name}-${index}`}
          file={file}
          index={index}
          onRemove={handleRemoveFile}
        />
      ))}
    </div>
  )
}
