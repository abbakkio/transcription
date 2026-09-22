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
    label: 'Автоопределение',
    shortLabel: 'AUTO',
    badgeClass: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 border-neutral-200',
  },
  {
    code: 'kk',
    label: 'Қазақша (KZ)',
    shortLabel: 'KZ',
    badgeClass: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200',
  },
  {
    code: 'ru',
    label: 'Русский (RU)',
    shortLabel: 'RU',
    badgeClass: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
  },
  {
    code: 'en',
    label: 'English (EN)',
    shortLabel: 'EN',
    badgeClass: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
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

