import {
  MusicalNoteIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import type { AudioFileItem, TranscriptionStatus } from '../../types/transcription'

interface FileTableRowProps {
  file: AudioFileItem
  isActive: boolean
  canRemove: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

const CIRCLE_RADIUS = 10
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

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
        <div role="cell" className="col-span-6 flex items-center gap-3 min-w-0">
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

        <div role="cell" className="col-span-2 font-mono text-xs text-neutral-500 tabular-nums">
          {file.size}
        </div>

        <div role="cell" className="col-span-2 flex items-center justify-end gap-2 pr-1">
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

        <div className="flex items-center justify-between text-[11px] text-neutral-400 pl-9.5 font-mono">
          <span>{file.duration} • {file.size}</span>
        </div>
      </div>
    </div>
  )
}
