import { useState, useRef, useEffect } from 'react'
import {
  MusicalNoteIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import {
  type AudioFileItem,
  type TranscriptionStatus,
  type TranscriptionLanguage,
  TRANSCRIPTION_LANGUAGES,
} from '../../types/transcription'

interface FileTableRowProps {
  file: AudioFileItem
  isActive: boolean
  canRemove: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onChangeLanguage?: (id: string, language: TranscriptionLanguage) => void
  onRetranscribe?: (id: string) => void
}

const CIRCLE_RADIUS = 10
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

function LanguageBadge({
  language,
  onChange,
  disabled,
}: {
  language: TranscriptionLanguage
  onChange?: (lang: TranscriptionLanguage) => void
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const currentOption =
    TRANSCRIPTION_LANGUAGES.find((l) => l.code === language) ?? TRANSCRIPTION_LANGUAGES[0]

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) setIsOpen((prev) => !prev)
        }}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer select-none ${currentOption.badgeClass} disabled:opacity-50 disabled:cursor-not-allowed`}
        title={`Язык модели: ${currentOption.label}. Нажмите для смены`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{currentOption.shortLabel}</span>
        <ChevronDownIcon className="w-2.5 h-2.5 opacity-60" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Выберите язык"
          className="absolute left-0 mt-1 w-44 rounded-xl bg-white border border-neutral-200/90 shadow-lg py-1 z-30 animate-in fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
            Язык распознавания
          </div>
          {TRANSCRIPTION_LANGUAGES.map((opt) => (
            <button
              key={opt.code}
              type="button"
              role="option"
              aria-selected={opt.code === language}
              onClick={() => {
                onChange?.(opt.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                opt.code === language
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>{opt.label}</span>
              {opt.code === language && (
                <CheckIcon className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusIndicator({
  status,
  progress,
  isActive,
}: {
  status: TranscriptionStatus
  progress?: number
  isActive: boolean
}) {
  if (status === 'processing') {
    const prog = progress ?? 35
    const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * prog) / 100

    return (
      <div className="relative w-7 h-7 flex items-center justify-center" title={`Обработка: ${prog}%`}>
        <svg className="w-7 h-7 -rotate-90 animate-spin" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r={CIRCLE_RADIUS}
            className="stroke-neutral-200"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="14"
            cy="14"
            r={CIRCLE_RADIUS}
            className="stroke-neutral-900 transition-all duration-300"
            strokeWidth="2.5"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center" title="В очереди">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center" title="Ошибка обработки">
        <ExclamationTriangleIcon className="w-4 h-4 stroke-[2]" />
      </div>
    )
  }

  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
        isActive
          ? 'bg-neutral-900 text-white shadow-xs'
          : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white'
      }`}
      title={isActive ? 'Выбранный файл' : 'Открыть аудио и текст'}
    >
      <ChevronRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />
    </div>
  )
}

export function FileTableRow({
  file,
  isActive,
  canRemove,
  onSelect,
  onRemove,
  onChangeLanguage,
  onRetranscribe,
}: FileTableRowProps) {
  return (
    <div
      role="row"
      tabIndex={0}
      aria-selected={isActive}
      onClick={() => onSelect(file.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(file.id)
        }
      }}
      className={`group w-full transition-all cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 border-b border-neutral-100 last:border-b-0 ${
        isActive
          ? 'bg-neutral-900/[0.04] font-medium border-l-4 border-l-neutral-900'
          : 'hover:bg-neutral-50/80 border-l-4 border-l-transparent bg-white'
      }`}
    >
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 items-center">
        <div role="cell" className="col-span-5 flex items-center gap-3 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200/70'
            }`}
          >
            <MusicalNoteIcon className="w-3.5 h-3.5" />
          </div>
          <span
            className={`text-xs sm:text-sm font-medium truncate ${
              isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-800'
            }`}
            title={file.name}
          >
            {file.name}
          </span>
        </div>

        <div role="cell" className="col-span-2 font-mono text-xs text-neutral-600 tabular-nums">
          {file.duration}
        </div>

        <div role="cell" className="col-span-1 font-mono text-xs text-neutral-500 tabular-nums">
          {file.size}
        </div>

        <div role="cell" className="col-span-2 flex items-center gap-1.5">
          <LanguageBadge
            language={file.language}
            onChange={(newLang) => onChangeLanguage?.(file.id, newLang)}
            disabled={file.status === 'processing'}
          />
        </div>

        <div role="cell" className="col-span-2 flex items-center justify-end gap-1.5 pr-1">
          {file.status === 'completed' && onRetranscribe && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRetranscribe(file.id)
              }}
              className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 transition-all"
              title="Перераспознать с выбранным языком"
              aria-label="Перераспознать аудиозапись"
            >
              <ArrowPathIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <StatusIndicator
            status={file.status}
            progress={file.progress}
            isActive={isActive}
          />

          {canRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(file.id)
              }}
              className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-1 rounded-md hover:bg-neutral-200/50 transition-all focus:opacity-100 shrink-0"
              title={`Удалить ${file.name}`}
              aria-label={`Удалить ${file.name}`}
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="sm:hidden p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isActive ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              <MusicalNoteIcon className="w-3.5 h-3.5" />
            </div>
            <span className={`text-xs font-semibold truncate ${isActive ? 'text-neutral-900' : 'text-neutral-800'}`}>
              {file.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusIndicator
              status={file.status}
              progress={file.progress}
              isActive={isActive}
            />
            {canRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(file.id)
                }}
                className="text-neutral-400 hover:text-red-500 p-1"
                aria-label={`Удалить ${file.name}`}
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 pl-9.5">
          <span className="font-mono text-neutral-400">{file.duration} • {file.size}</span>
          <div className="flex items-center gap-1.5">
            <LanguageBadge
              language={file.language}
              onChange={(newLang) => onChangeLanguage?.(file.id, newLang)}
              disabled={file.status === 'processing'}
            />
            {file.status === 'completed' && onRetranscribe && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRetranscribe(file.id)
                }}
                className="text-neutral-400 hover:text-neutral-900 p-1"
                title="Перераспознать аудиозапись"
                aria-label="Перераспознать аудиозапись"
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
