import { v4 as uuidv4 } from "uuid"

import { createClient } from "./client"

const BUCKET_NAME = "chat-attachments"
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 5

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
]

export type UploadedFile = {
  url: string
  name: string
  mediaType: string
  size: number
}

export const validateFiles = (files: File[]): string | null => {
  if (files.length > MAX_FILES) {
    return `You can attach up to ${MAX_FILES} files at a time`
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the 10MB size limit`
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `"${file.name}" has an unsupported file type. Supported: images, PDF, text, CSV, JSON`
    }
  }

  return null
}

export const uploadChatFiles = async (
  files: File[],
  chatId: string,
  userId: string,
): Promise<UploadedFile[]> => {
  const supabase = createClient()

  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split(".").pop()
    const uniqueName = `${uuidv4()}.${fileExt}`
    const filePath = `${userId}/${chatId}/${uniqueName}`

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw new Error(`Failed to upload "${file.name}": ${error.message}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return {
      url: publicUrl,
      name: file.name,
      mediaType: file.type,
      size: file.size,
      path: filePath,
    }
  })

  const results = await Promise.allSettled(uploadPromises)

  const succeeded = results.filter(
    (r): r is PromiseFulfilledResult<UploadedFile & { path: string }> => r.status === "fulfilled",
  )
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected")

  // If some uploads failed, clean up the ones that succeeded
  if (failed.length > 0) {
    const pathsToRemove = succeeded.map((r) => r.value.path)

    if (pathsToRemove.length > 0) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove(pathsToRemove)
        .catch(() => {
          // Best-effort cleanup — ignore errors
        })
    }

    const firstError = failed[0].reason
    throw firstError instanceof Error ? firstError : new Error("Failed to upload files")
  }

  return succeeded.map(({ value: { path: _, ...file } }) => file)
}
