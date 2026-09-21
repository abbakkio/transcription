import type { AudioFileItem } from '../../types/transcription'

interface BatchProgressBarProps {
  files: AudioFileItem[]
  currentFileIndex: number
  overallProgress: number
}

export function BatchProgressBar({
  files,
  currentFileIndex,
  overallProgress,
}: BatchProgressBarProps) {
  const currentFile = files[currentFileIndex] ?? files[0]

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Прогресс транскрибации файлов"
      className="w-full bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-none">
              Идет транскрибация аудио
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Обработка файла {currentFileIndex + 1} из {files.length}:{' '}
              <span className="font-medium text-neutral-900">{currentFile?.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-center">
          <span className="text-xs font-mono font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full">
            {overallProgress}%
          </span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={overallProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Общий прогресс транскрибации"
        className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden mb-3"
      >
        <div
          className="bg-neutral-900 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 text-center">
        <div className={overallProgress >= 30 ? 'font-semibold text-neutral-900' : ''}>
          1. Шумоподавление
        </div>
        <div className={overallProgress >= 65 ? 'font-semibold text-neutral-900' : ''}>
          2. Распознавание речи
        </div>
        <div className={overallProgress >= 95 ? 'font-semibold text-neutral-900' : ''}>
          3. Расстановка таймкодов
        </div>
      </div>
    </div>
  )
}
