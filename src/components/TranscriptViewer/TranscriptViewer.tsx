import { useState, useMemo } from 'react'
import { ScrollShadow } from '@heroui/react'
import {
  DocumentTextIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import type { AudioFileItem } from '../../types/transcription'
import { downloadSingleTranscript } from '../../utils/exportZip'
import { getTranscriptText } from '../../utils/audioFiles'

interface TranscriptViewerProps {
  file: AudioFileItem
  onSeek?: (seconds: number) => void
}

const ACTION_BTN_CLASS =
  'w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed'

export function TranscriptViewer({ file, onSeek }: TranscriptViewerProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'raw' | 'timestamps'>('raw')

  const rawFullText = useMemo(() => getTranscriptText(file), [file])

  const formattedWithTimestamps = useMemo(
    () => file.segments.map((s) => `[${s.time}] ${s.text}`).join('\n\n'),
    [file.segments],
  )

  const currentExportText = viewMode === 'timestamps' ? formattedWithTimestamps : rawFullText

  const wordCount = useMemo(
    () => rawFullText.split(/\s+/).filter(Boolean).length,
    [rawFullText],
  )

  const handleCopy = () => {
    navigator.clipboard
      .writeText(currentExportText)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  const handleDownload = () => {
    downloadSingleTranscript(file, viewMode === 'timestamps')
  }

  return (
    <div
      aria-labelledby="transcript-panel-title"
      className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col min-h-[460px] sm:h-[520px] overflow-hidden"
    >
      <div className="p-3.5 sm:p-5 pb-3 sm:pb-3.5 border-b border-neutral-100 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
            <DocumentTextIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 id="transcript-panel-title" className="font-semibold text-neutral-900 text-sm sm:text-base leading-none truncate">
              <span className="hidden sm:inline">Расшифровка</span>
              <span className="sm:hidden">Текст</span>
            </h2>
            <p className="text-[11px] text-neutral-400 mt-1 truncate">
              {wordCount} слов
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div
            role="tablist"
            aria-label="Режим отображения текста"
            className="inline-flex p-0.5 bg-neutral-100 rounded-lg text-[11px] font-medium border border-neutral-200/60"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'raw'}
              onClick={() => setViewMode('raw')}
              className={`px-2 py-1 rounded-md transition-all select-none ${
                viewMode === 'raw'
                  ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span className="hidden xl:inline">Сырой текст</span>
              <span className="xl:hidden">Текст</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'timestamps'}
              onClick={() => setViewMode('timestamps')}
              className={`px-2 py-1 rounded-md transition-all select-none ${
                viewMode === 'timestamps'
                  ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span className="hidden xl:inline">С таймкодами</span>
              <span className="xl:hidden">Таймкоды</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!rawFullText}
            className={ACTION_BTN_CLASS}
            title={copied ? 'Скопировано!' : 'Скопировать текст'}
            aria-label={copied ? 'Скопировано!' : 'Скопировать текст'}
          >
            {copied ? (
              <ClipboardDocumentCheckIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600" />
            ) : (
              <ClipboardDocumentIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neutral-600" />
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!rawFullText}
            className={ACTION_BTN_CLASS}
            title={viewMode === 'timestamps' ? 'Скачать .txt с таймкодами' : 'Скачать .txt'}
            aria-label="Скачать расшифровку (.txt)"
          >
            <ArrowDownTrayIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neutral-600" />
          </button>
        </div>
      </div>

      <ScrollShadow
        size={60}
        orientation="vertical"
        className="flex-1 p-5 sm:p-6 focus-visible:outline-none"
        aria-label="Текст распознанного аудио"
      >
        {!rawFullText ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
            <DocumentTextIcon className="w-10 h-10 mb-2 text-neutral-300 stroke-1" />
            <p className="text-sm font-medium text-neutral-600">Нет расшифровки для этого файла</p>
          </div>
        ) : viewMode === 'timestamps' ? (
          <div className="space-y-2 select-text font-normal">
            {file.segments.map((segment) => (
              <button
                type="button"
                key={segment.id}
                onClick={() => onSeek?.(segment.startSeconds)}
                className="group flex items-start gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 transition-colors w-full text-left cursor-pointer"
                title="Нажмите, чтобы перейти к этому фрагменту"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white group-focus-visible:bg-neutral-900 group-focus-visible:text-white text-neutral-500 font-mono text-xs tabular-nums transition-colors shrink-0 select-none mt-0.5">
                  {segment.time}
                </span>
                <span className="flex-1 text-sm sm:text-base text-neutral-800 group-hover:text-neutral-950 leading-relaxed transition-colors">
                  {segment.text}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 text-neutral-800 select-text font-normal">
            {file.segments.map((segment) => (
              <button
                type="button"
                key={segment.id}
                onClick={() => onSeek?.(segment.startSeconds)}
                className="w-full text-left text-neutral-800 text-sm sm:text-base leading-relaxed hover:text-neutral-950 focus-visible:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-lg p-1.5 -mx-1.5 transition-colors cursor-pointer"
                title="Нажмите, чтобы перейти к этому фрагменту"
              >
                {segment.text}
              </button>
            ))}
          </div>
        )}
      </ScrollShadow>
    </div>
  )
}
