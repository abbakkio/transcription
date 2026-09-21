import JSZip from 'jszip'
import type { AudioFileItem } from '../types/transcription'
import { sanitizeBaseFileName, getTranscriptText } from './audioFiles'

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function exportAllTranscriptsAsZip(
  files: AudioFileItem[],
): Promise<void> {
  const completedFiles = files.filter((f) => f.status === 'completed' && f.segments.length > 0)
  if (completedFiles.length === 0) return

  const zip = new JSZip()
  const folder = zip.folder('transcriptions') ?? zip

  const nameCounts = new Map<string, number>()
  for (const file of completedFiles) {
    const safeBase = sanitizeBaseFileName(file.name)
    const count = nameCounts.get(safeBase) ?? 0
    nameCounts.set(safeBase, count + 1)

    const fileName = count === 0
      ? `${safeBase}_transcription.txt`
      : `${safeBase}_(${count})_transcription.txt`

    const content = getTranscriptText(file)
    folder.file(fileName, content)
  }

  const summaryContent = [
    '=== АРХИВ ТРАНСКРИБИРОВАННЫХ АУДИОЗАПИСЕЙ ===',
    `Дата выгрузки: ${new Date().toLocaleString('ru-RU')}`,
    `Всего файлов: ${completedFiles.length}`,
    '',
    ...completedFiles.map(
      (f, idx) =>
        `${idx + 1}. ${f.name} — ${f.duration} (${f.size})`,
    ),
  ].join('\n')

  folder.file('README_transcriptions.txt', summaryContent)

  const blob = await zip.generateAsync({ type: 'blob' })
  triggerDownload(blob, `transcriptions_${new Date().toISOString().slice(0, 10)}.zip`)
}

export function downloadSingleTranscript(
  file: AudioFileItem,
  withTimestamps: boolean = false,
): void {
  const safeBase = sanitizeBaseFileName(file.name)
  const content = withTimestamps
    ? file.segments.map((s) => `[${s.time}] ${s.text}`).join('\n\n')
    : getTranscriptText(file)

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, `${safeBase}_transcription.txt`)
}
