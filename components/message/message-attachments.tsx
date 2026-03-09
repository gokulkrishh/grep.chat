"use client"

import Image from "next/image"

import { UIMessage } from "ai"

import { FileIcon } from "../icons"

type Props = {
  message: UIMessage
}

const isImageMediaType = (mediaType: string): boolean => {
  return mediaType.startsWith("image/")
}

const getFileName = (part: { url: string; filename?: string }): string => {
  if (part.filename) return part.filename

  try {
    const pathname = new URL(part.url).pathname
    const segments = pathname.split("/")
    const filename = segments.at(-1) ?? "file"
    // Remove the UUID prefix if present (format: uuid.ext)
    const parts = filename.split(".")
    if (parts.length >= 2) {
      return `file.${parts.at(-1)}`
    }
    return filename
  } catch {
    return "file"
  }
}

export default function MessageAttachments({ message }: Props) {
  const fileParts = message.parts?.filter(
    (part): part is Extract<(typeof message.parts)[number], { type: "file" }> =>
      part.type === "file",
  )

  if (!fileParts?.length) {
    return null
  }

  const imageParts = fileParts.filter((part) => isImageMediaType(part.mediaType))
  const otherParts = fileParts.filter((part) => !isImageMediaType(part.mediaType))

  return (
    <div className="flex flex-col gap-2">
      {imageParts.length > 0 && (
        <div className="flex flex-row flex-wrap justify-end gap-2">
          {imageParts.map((part, index) => (
            <a
              key={`${message.id}-img-${index}`}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:ring-ring block overflow-hidden rounded-2xl focus-visible:ring-[3px] focus-visible:outline-none"
              aria-label={`View attached image ${index + 1}`}
              tabIndex={0}
            >
              <Image
                src={part.url}
                alt={`Attachment ${index + 1}`}
                width={256}
                height={256}
                className="max-h-64 max-w-64 rounded-2xl object-cover transition-opacity hover:opacity-90"
              />
            </a>
          ))}
        </div>
      )}

      {otherParts.length > 0 && (
        <div className="flex flex-row flex-wrap justify-end gap-2">
          {otherParts.map((part, index) => (
            <a
              key={`${message.id}-file-${index}`}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted/50 border-input hover:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
              aria-label={`Download ${getFileName(part)}`}
              tabIndex={0}
            >
              <FileIcon className="text-muted-foreground size-4 shrink-0" />
              <span className="max-w-40 truncate">{getFileName(part)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
