export interface TranscriptSegment {
  id: number
  lang: 'KZ' | 'RU'
  time: string
  startSeconds: number
  endSeconds: number
  text: string
}

export type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'error'

export type TranscriptViewMode = 'timestamps' | 'raw'

export interface AudioFileItem {
  id: string
  name: string
  size: string
  duration: string
  durationSeconds: number
  status: TranscriptionStatus
  progress: number
  detectedLanguage?: 'KZ' | 'RU' | 'KZ/RU'
  audioUrl?: string
  file?: File
  segments: TranscriptSegment[]
  rawText: string
}
