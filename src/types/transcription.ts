export type TranscriptionLanguage = 'auto' | 'kk' | 'ru' | 'en'

export interface LanguageOption {
  code: TranscriptionLanguage
  label: string
  shortLabel: string
  badgeClass: string
}

export const TRANSCRIPTION_LANGUAGES: LanguageOption[] = [
  {
    code: 'auto',
    label: 'Авто',
    shortLabel: 'Авто',
    badgeClass: 'bg-white text-neutral-800 hover:bg-neutral-100/80 border-neutral-400 hover:border-neutral-600 shadow-2xs',
  },
  {
    code: 'ru',
    label: 'Русский',
    shortLabel: 'Русский',
    badgeClass: 'bg-white text-neutral-800 hover:bg-neutral-100/80 border-neutral-400 hover:border-neutral-600 shadow-2xs',
  },
  {
    code: 'kk',
    label: 'Казахский',
    shortLabel: 'Казахский',
    badgeClass: 'bg-white text-neutral-800 hover:bg-neutral-100/80 border-neutral-400 hover:border-neutral-600 shadow-2xs',
  },
  {
    code: 'en',
    label: 'Английский',
    shortLabel: 'Английский',
    badgeClass: 'bg-white text-neutral-800 hover:bg-neutral-100/80 border-neutral-400 hover:border-neutral-600 shadow-2xs',
  },
]

export interface TranscriptSegment {
  id: number
  lang: 'KZ' | 'RU' | 'EN'
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
  language: TranscriptionLanguage
  detectedLanguage?: 'KZ' | 'RU' | 'EN' | 'KZ/RU'
  audioUrl?: string
  file?: File
  segments: TranscriptSegment[]
  rawText: string
}

