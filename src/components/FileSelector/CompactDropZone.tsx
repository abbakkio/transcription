import { useState, type DragEvent } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { isValidAudioFile } from '../../utils/audioFiles'

interface CompactDropZoneProps {
  onFilesDropped: (files: File[]) => void
  onOpenDialog: () => void
}

export function CompactDropZone({ onFilesDropped, onOpenDialog }: CompactDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(isValidAudioFile)
      if (droppedFiles.length > 0) {
        onFilesDropped(droppedFiles)
      }
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenDialog}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDialog()
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full py-2.5 px-3.5 mb-3.5 rounded-xl border border-dashed text-xs flex items-center justify-between transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
        isDragOver
          ? 'border-neutral-900 bg-neutral-100 text-neutral-900 shadow-xs'
          : 'border-neutral-200/90 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50 text-neutral-600'
      }`}
      aria-label="Зона быстрой загрузки: перетащите аудиофайлы сюда или нажмите для выбора"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-md bg-neutral-200/70 text-neutral-700 flex items-center justify-center shrink-0">
          <ArrowUpTrayIcon className="w-3.5 h-3.5" />
        </div>
        <p className="truncate">
          <span className="font-semibold text-neutral-800">Перетащите аудиофайлы сюда</span>
          <span className="hidden sm:inline text-neutral-500"> для пакетной обработки или нажмите для выбора</span>
        </p>
      </div>

      <span className="hidden md:inline-flex items-center text-[11px] font-mono text-neutral-400 shrink-0">
        MP3, WAV, M4A, FLAC
      </span>
    </div>
  )
}
