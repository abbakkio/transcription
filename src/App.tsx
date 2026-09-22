import { useState, useRef, useEffect } from 'react'
import { Header } from './components/Header/Header'
import { FileSelector } from './components/FileSelector/FileSelector'
import { AudioPlayerCard } from './components/AudioPlayer/AudioPlayerCard'
import { TranscriptViewer } from './components/TranscriptViewer/TranscriptViewer'
import { BatchProgressBar } from './components/BatchProgress/BatchProgressBar'
import { BatchDropzoneModal } from './components/BatchDropzone/BatchDropzoneModal'
import { NotificationToast, type ToastMessage } from './components/Notification/NotificationToast'
import { INITIAL_BATCH_FILES, SAMPLE_TRANSCRIPT_1 } from './data/sampleTranscript'
import { exportAllTranscriptsAsZip } from './utils/exportZip'
import type { AudioFileItem } from './types/transcription'
import type { ScanResult } from './utils/folderScanner'

export default function App() {
  const [files, setFiles] = useState<AudioFileItem[]>(INITIAL_BATCH_FILES)
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_BATCH_FILES[0].id)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [seekTarget, setSeekTarget] = useState<{ seconds: number; timestamp: number } | null>(null)
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)
  const toastIdRef = useRef(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0]

  const handleSelectFile = (id: string) => {
    setActiveFileId(id)
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(target.audioUrl)
      }
      const remaining = prev.filter((f) => f.id !== id)
      if (activeFileId === id && remaining.length > 0) {
        setActiveFileId(remaining[0].id)
      }
      return remaining
    })
  }

  const handleRestoreDemoFiles = () => {
    files.forEach((f) => {
      if (f.audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(f.audioUrl)
      }
    })
    setFiles(INITIAL_BATCH_FILES)
    setActiveFileId(INITIAL_BATCH_FILES[0].id)
  }

  const handleAddBatchFiles = (newFiles: File[], scanInfo?: ScanResult) => {
    if (newFiles.length === 0) {
      if (scanInfo && scanInfo.skippedCount > 0) {
        toastIdRef.current += 1
        setToastMessage({
          id: `toast-${toastIdRef.current}`,
          title: 'Аудиофайлы не найдены',
          detail: `Пропущено неаудио-файлов: ${scanInfo.skippedCount} (изображения, документы и др.)`,
          type: 'warning',
        })
      }
      return
    }

    if (scanInfo?.skippedCount) {
      const folderHint = scanInfo.folderNames.length > 0 ? ` из папки "${scanInfo.folderNames[0]}"` : ''
      toastIdRef.current += 1
      setToastMessage({
        id: `toast-${toastIdRef.current}`,
        title: `Добавлено аудиозаписей: ${newFiles.length}${folderHint}`,
        detail: `Пропущено неаудио-файлов: ${scanInfo.skippedCount} (PDF, фото и др.)`,
        type: 'success',
      })
    } else if (scanInfo?.folderNames.length) {
      toastIdRef.current += 1
      setToastMessage({
        id: `toast-${toastIdRef.current}`,
        title: `Импортирована папка "${scanInfo.folderNames[0]}"`,
        detail: `Успешно добавлено аудиозаписей: ${newFiles.length}`,
        type: 'success',
      })
    } else if (newFiles.length > 1) {
      toastIdRef.current += 1
      setToastMessage({
        id: `toast-${toastIdRef.current}`,
        title: 'Пакетный импорт завершен',
        detail: `Добавлено аудиозаписей: ${newFiles.length}`,
        type: 'info',
      })
    }

    const newItems: AudioFileItem[] = newFiles.map((file, idx) => ({
      id: `file-custom-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} МБ`,
      duration: '02:30',
      durationSeconds: 150,
      status: 'pending',
      progress: 0,
      language: 'auto',
      detectedLanguage: 'KZ/RU',
      audioUrl: URL.createObjectURL(file),
      file,
      segments: SAMPLE_TRANSCRIPT_1,
      rawText: SAMPLE_TRANSCRIPT_1.map((s) => s.text).join('\n\n'),
    }))

    const updatedList = [...files, ...newItems]
    setFiles(updatedList)
    setActiveFileId(newItems[0].id)

    runTranscriptionProcess(newItems, updatedList)
  }

  const runTranscriptionProcess = (itemsToProcess: AudioFileItem[], allFiles: AudioFileItem[]) => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setIsTranscribing(true)
    setOverallProgress(5)
    setCurrentFileIndex(0)

    const processIds = new Set(itemsToProcess.map((i) => i.id))
    setFiles((current) =>
      current.map((item) =>
        processIds.has(item.id) ? { ...item, status: 'processing', progress: 10 } : item,
      ),
    )

    const totalSteps = itemsToProcess.length
    let currentStep = 0

    timerRef.current = setInterval(() => {
      setOverallProgress((prev) => {
        if (prev >= 95) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          timeoutRef.current = setTimeout(() => {
            setFiles((current) =>
              current.map((item) =>
                processIds.has(item.id)
                  ? { ...item, status: 'completed', progress: 100 }
                  : item,
              ),
            )
            setIsTranscribing(false)
            setOverallProgress(100)
          }, 400)
          return 100
        }

        const nextProgress = prev + 12
        const step = Math.min(totalSteps - 1, Math.floor((nextProgress / 100) * totalSteps))
        if (step !== currentStep) {
          currentStep = step
          setCurrentFileIndex(allFiles.findIndex((f) => f.id === itemsToProcess[step]?.id))
        }

        setFiles((current) =>
          current.map((item) =>
            processIds.has(item.id) ? { ...item, progress: nextProgress } : item,
          ),
        )

        return nextProgress
      })
    }, 280)
  }

  const handleExportZip = () => {
    exportAllTranscriptsAsZip(files)
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 flex flex-col items-center selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="w-full max-w-6xl px-3.5 sm:px-6 mt-8 sm:mt-10 mb-16 flex flex-col">
        {isTranscribing && (
          <BatchProgressBar
            files={files}
            currentFileIndex={currentFileIndex}
            overallProgress={overallProgress}
          />
        )}

        <FileSelector
          files={files}
          activeFileId={activeFileId}
          onSelectFile={handleSelectFile}
          onExportZip={handleExportZip}
          onAddFilesClick={() => setIsUploadModalOpen(true)}
          onDirectDropFiles={handleAddBatchFiles}
          onRemoveFile={handleRemoveFile}
        />

        {activeFile ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            <AudioPlayerCard
              key={`player-${activeFile.id}`}
              file={activeFile}
              seekTarget={seekTarget}
            />

            <TranscriptViewer
              key={`viewer-${activeFile.id}`}
              file={activeFile}
              onSeek={(seconds) => setSeekTarget({ seconds, timestamp: Date.now() })}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400">
            <p className="text-base font-medium text-neutral-700">Все файлы удалены</p>
            <button
              type="button"
              onClick={handleRestoreDemoFiles}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Восстановить демонстрационные файлы
            </button>
          </div>
        )}
      </main>

      <BatchDropzoneModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddFiles={handleAddBatchFiles}
      />

      <NotificationToast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  )
}
