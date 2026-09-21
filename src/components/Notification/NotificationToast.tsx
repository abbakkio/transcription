import { useEffect } from 'react'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export interface ToastMessage {
  id: string
  title: string
  detail?: string
  type?: 'success' | 'info' | 'warning'
}

interface NotificationToastProps {
  message: ToastMessage | null
  onDismiss: () => void
  duration?: number
}

export function NotificationToast({
  message,
  onDismiss,
  duration = 4500,
}: NotificationToastProps) {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, onDismiss, duration])

  if (!message) return null

  const type = message.type ?? 'info'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full bg-white rounded-2xl border border-neutral-200/90 shadow-xl p-3.5 sm:p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="shrink-0 mt-0.5">
        {type === 'success' && (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
        {type === 'info' && (
          <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
            <InformationCircleIcon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
        {type === 'warning' && (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-neutral-900 leading-snug">
          {message.title}
        </p>
        {message.detail && (
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 leading-relaxed">
            {message.detail}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition-colors shrink-0 -mr-1 -mt-1"
        aria-label="Закрыть уведомление"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
