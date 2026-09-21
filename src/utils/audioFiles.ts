import type { AudioFileItem } from '../types/transcription'

const ALLOWED_EXTENSIONS = /\.(mp3|wav|m4a|ogg|flac|aac)$/i
const MAX_FILE_SIZE_BYTES = 250 * 1024 * 1024 // 250 MB

export function isValidAudioFile(file: File): boolean {
  const isAudioType = file.type.startsWith('audio/') || ALLOWED_EXTENSIONS.test(file.name)
  const isUnderSizeLimit = file.size <= MAX_FILE_SIZE_BYTES
  return isAudioType && isUnderSizeLimit
}

export function sanitizeBaseFileName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '')
  const safeName = nameWithoutExtension
    .replace(/\.\./g, '')
    .replace(/[/\\?%*:|"<>]/g, '_')
    .trim()
  return safeName || 'audio_file'
}

export function getTranscriptText(file: AudioFileItem): string {
  return file.rawText || file.segments.map((s) => s.text).join('\n\n')
}
