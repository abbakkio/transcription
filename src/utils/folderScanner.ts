import { isValidAudioFile } from './audioFiles'

export interface ScanResult {
  audioFiles: File[]
  skippedCount: number
  totalScanned: number
  folderNames: string[]
}

const MAX_DEPTH = 5
const MAX_SCAN_FILES = 200

async function readAllDirectoryEntries(
  reader: FileSystemDirectoryReader,
): Promise<FileSystemEntry[]> {
  const entries: FileSystemEntry[] = []
  let batch: FileSystemEntry[] = []
  do {
    batch = await new Promise<FileSystemEntry[]>((resolve) => {
      reader.readEntries(resolve, () => resolve([]))
    })
    entries.push(...batch)
  } while (batch.length > 0)
  return entries
}

async function traverseEntry(
  entry: FileSystemEntry,
  parentPath: string,
  depth: number,
  result: ScanResult,
): Promise<void> {
  if (depth > MAX_DEPTH || result.totalScanned >= MAX_SCAN_FILES) {
    return
  }

  if (entry.isFile) {
    result.totalScanned++
    const fileEntry = entry as FileSystemFileEntry
    try {
      const rawFile = await new Promise<File>((resolve, reject) => {
        fileEntry.file(resolve, reject)
      })

      if (isValidAudioFile(rawFile)) {
        const contextualFile = parentPath
          ? new File([rawFile], `${parentPath}/${rawFile.name}`, {
              type: rawFile.type,
              lastModified: rawFile.lastModified,
            })
          : rawFile
        result.audioFiles.push(contextualFile)
      } else {
        result.skippedCount++
      }
    } catch {
      result.skippedCount++
    }
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry
    if (!parentPath && !result.folderNames.includes(entry.name)) {
      result.folderNames.push(entry.name)
    }

    try {
      const reader = dirEntry.createReader()
      const childEntries = await readAllDirectoryEntries(reader)
      const nextParentPath = parentPath ? `${parentPath}/${entry.name}` : entry.name

      for (const child of childEntries) {
        if (result.totalScanned >= MAX_SCAN_FILES) break
        await traverseEntry(child, nextParentPath, depth + 1, result)
      }
    } catch {
      // Ignore inaccessible directories
    }
  }
}

export async function scanDroppedItems(dataTransfer: DataTransfer): Promise<ScanResult> {
  const result: ScanResult = {
    audioFiles: [],
    skippedCount: 0,
    totalScanned: 0,
    folderNames: [],
  }

  const items = dataTransfer.items
  const hasWebKitEntry =
    items &&
    items.length > 0 &&
    typeof (items[0] as unknown as { webkitGetAsEntry?: unknown }).webkitGetAsEntry === 'function'

  if (hasWebKitEntry) {
    const rootEntries: FileSystemEntry[] = []
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry?.()
      if (entry) {
        rootEntries.push(entry)
      }
    }

    for (const entry of rootEntries) {
      if (result.totalScanned >= MAX_SCAN_FILES) break
      await traverseEntry(entry, '', 1, result)
    }
  } else {
    // Fallback for standard files drag
    const files = Array.from(dataTransfer.files || [])
    for (const file of files) {
      result.totalScanned++
      if (isValidAudioFile(file)) {
        result.audioFiles.push(file)
      } else {
        result.skippedCount++
      }
    }
  }

  return result
}
