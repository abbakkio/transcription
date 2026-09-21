import {
  QueueListIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import type { AudioFileItem } from '../../types/transcription'
import { FileTableRow } from './FileTableRow'
import { CompactDropZone } from './CompactDropZone'

export interface FileSelectorProps {
  files: AudioFileItem[]
  activeFileId: string
  onSelectFile: (id: string) => void
  onExportZip: () => void
  onAddFilesClick: () => void
  onDirectDropFiles?: (files: File[]) => void
  onRemoveFile: (id: string) => void
}

export function FileSelector({
  files,
  activeFileId,
  onSelectFile,
  onExportZip,
  onAddFilesClick,
  onDirectDropFiles,
  onRemoveFile,
}: FileSelectorProps) {
  const completedCount = files.filter((f) => f.status === 'completed').length

  const handleDropFiles = (droppedFiles: File[]) => {
    if (onDirectDropFiles) {
      onDirectDropFiles(droppedFiles)
    } else {
      onAddFilesClick()
    }
  }

  return (
    <section
      aria-label="Список файлов транскрибации"
      className="w-full bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-4 sm:p-5 mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-neutral-100 gap-3 mb-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
            <QueueListIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-neutral-900 text-sm sm:text-base leading-none truncate">
              Файлы транскрибации
            </h2>
            <p className="text-[11px] text-neutral-400 mt-1 truncate">
              Нажмите на строку для переключения аудиодорожки и расшифровки
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={onExportZip}
            disabled={completedCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-medium transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            title="Скачать все расшифровки единым ZIP архивом"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5 text-neutral-500" />
            <span>Скачать все (.zip)</span>
          </button>

          <button
            type="button"
            onClick={onAddFilesClick}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:scale-[0.98]"
            title="Загрузить аудиофайл или пакет файлов"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Загрузить аудио</span>
          </button>
        </div>
      </div>

      <CompactDropZone
        onFilesDropped={handleDropFiles}
        onOpenDialog={onAddFilesClick}
      />

      <div
        role="table"
        aria-label="Таблица аудиофайлов транскрибации"
        className="w-full rounded-xl border border-neutral-200/90 overflow-hidden bg-white shadow-2xs"
      >
        <div
          role="row"
          className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 bg-neutral-50/70 border-l-4 border-l-transparent"
        >
          <div role="columnheader" className="col-span-6">Аудиозапись</div>
          <div role="columnheader" className="col-span-2">Длительность</div>
          <div role="columnheader" className="col-span-2">Размер</div>
          <div role="columnheader" className="col-span-2 text-right pr-2">Статус</div>
        </div>

        <div role="rowgroup" className="divide-y divide-neutral-100">
          {files.map((file) => (
            <FileTableRow
              key={file.id}
              file={file}
              isActive={file.id === activeFileId}
              canRemove={true}
              onSelect={onSelectFile}
              onRemove={onRemoveFile}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
