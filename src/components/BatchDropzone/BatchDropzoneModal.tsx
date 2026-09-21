import { useState, useRef, useEffect } from 'react'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { isValidAudioFile } from '../../utils/audioFiles'

interface BatchDropzoneModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFiles: (files: File[]) => void
}

export function BatchDropzoneModal({
  isOpen,
  onClose,
  onAddFiles,
}: BatchDropzoneModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(isValidAudioFile)
      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles])
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter(isValidAudioFile)
      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles])
      }
      e.target.value = ''
    }
  }

  const handleRemoveOne = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onAddFiles(selectedFiles)
      setSelectedFiles([])
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full p-5 sm:p-6 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
          <div>
            <h2 id="upload-modal-title" className="font-semibold text-neutral-900 text-base">
              Загрузка аудиофайлов
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Выберите один или несколько файлов для транскрибации
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100"
            aria-label="Закрыть окно"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-neutral-900 bg-neutral-100/70 scale-[0.99]'
              : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center mx-auto mb-3">
            <ArrowUpTrayIcon className="w-6 h-6 stroke-[1.8]" />
          </div>
          <p className="text-sm font-semibold text-neutral-800">
            Перетащите аудиофайлы сюда
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            или <span className="text-neutral-900 font-semibold underline underline-offset-2">выберите файлы на диске</span>
          </p>
          <p className="text-[11px] text-neutral-400 mt-2">
            Поддерживаются MP3, WAV, M4A, OGG, FLAC (до 250 МБ)
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 flex-1 overflow-y-auto max-h-48 space-y-2 pr-1">
            <p className="text-xs font-semibold text-neutral-700">
              Выбрано файлов: {selectedFiles.length}
            </p>
            {selectedFiles.map((f, idx) => (
              <div
                key={`${f.name}-${f.size}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-neutral-400">{idx + 1}.</span>
                  <span className="font-medium text-neutral-800 truncate max-w-[220px]">
                    {f.name}
                  </span>
                  <span className="text-[11px] text-neutral-400 shrink-0">
                    ({(f.size / (1024 * 1024)).toFixed(1)} МБ)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveOne(idx)
                  }}
                  className="text-neutral-400 hover:text-red-500 p-1"
                  title="Удалить"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium border border-neutral-200 hover:bg-neutral-50 text-neutral-700"
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={selectedFiles.length === 0}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            Транскрибировать {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
