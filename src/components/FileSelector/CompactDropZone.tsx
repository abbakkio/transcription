import { useState, type DragEvent } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { scanDroppedItems, type ScanResult } from '../../utils/folderScanner'

interface CompactDropZoneProps {
  onFilesDropped: (files: File[], scanInfo?: ScanResult) => void
  onOpenDialog: () => void
}

export function CompactDropZone({ onFilesDropped, onOpenDialog }: CompactDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

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

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setIsScanning(true)

    try {
      const result = await scanDroppedItems(e.dataTransfer)
      if (result.audioFiles.length > 0 || result.skippedCount > 0) {
        onFilesDropped(result.audioFiles, result)
      }
    } finally {
      setIsScanning(false)
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
      aria-label="Зона быстрой загрузки: перетащите аудиофайлы или папки сюда или нажмите для выбора"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-md bg-neutral-200/70 text-neutral-700 flex items-center justify-center shrink-0">
          {isScanning ? (
            <svg className="w-3.5 h-3.5 animate-spin text-neutral-900" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <ArrowUpTrayIcon className="w-3.5 h-3.5" />
          )}
        </div>
        <p className="truncate">
          <span className="font-semibold text-neutral-800">
            {isScanning ? 'Сканирование папок и аудиофайлов...' : 'Перетащите аудиофайлы или папки сюда'}
          </span>
          <span className="hidden sm:inline text-neutral-500">
            {isScanning ? '' : ' для пакетной обработки или нажмите для выбора'}
          </span>
        </p>
      </div>

      <span className="hidden md:inline-flex items-center text-[11px] font-mono text-neutral-400 shrink-0">
        MP3, WAV, M4A, FLAC + папки
      </span>
    </div>
  )
}
