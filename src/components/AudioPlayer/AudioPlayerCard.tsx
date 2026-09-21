import { useState, useEffect, useRef } from 'react'
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  BackwardIcon,
  ForwardIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline'
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'
import type { AudioFileItem } from '../../types/transcription'

interface AudioPlayerCardProps {
  file: AudioFileItem
  seekTarget?: { seconds: number; timestamp: number } | null
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayerCard({ file, seekTarget }: AudioPlayerCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const totalDuration = file.durationSeconds || 120

  useEffect(() => {
    if (!seekTarget) return

    if (audioRef.current && file.audioUrl) {
      audioRef.current.currentTime = seekTarget.seconds
      audioRef.current.play().catch(() => {})
    }

    const frameId = requestAnimationFrame(() => {
      setCurrentTime(seekTarget.seconds)
      setIsPlaying(true)
    })

    return () => cancelAnimationFrame(frameId)
  }, [seekTarget, file.audioUrl])

  // Симуляция таймера если нет реального аудио-источника
  useEffect(() => {
    if (!file.audioUrl && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1 * playbackRate
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, file.audioUrl, totalDuration, playbackRate])

  const togglePlay = () => {
    if (file.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false))
      }
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (newSeconds: number) => {
    setCurrentTime(newSeconds)
    if (audioRef.current) {
      audioRef.current.currentTime = newSeconds
    }
  }

  const handleSkip = (secondsDelta: number) => {
    const nextTime = Math.max(0, Math.min(totalDuration, currentTime + secondsDelta))
    handleSeek(nextTime)
  }

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  return (
    <div
      aria-label="Аудиоплеер записи"
      className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between min-h-[460px] sm:h-[520px] overflow-hidden"
    >
      {file.audioUrl && (
        <audio
          ref={audioRef}
          src={file.audioUrl}
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="p-4 sm:p-5 pb-3.5 border-b border-neutral-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
            <SpeakerWaveIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-neutral-900 text-sm sm:text-base leading-none truncate">
              Аудиодорожка
            </h2>
            <p className="text-[11px] text-neutral-400 mt-1 truncate">
              {file.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
            aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-4 h-4 text-red-500" />
            ) : (
              <SpeakerWaveIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-4 shadow-sm">
          <MusicalNoteIcon className="w-9 h-9" />
        </div>

        <h3 className="font-bold text-neutral-900 text-base sm:text-lg max-w-xs truncate" title={file.name}>
          {file.name}
        </h3>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          {file.size} • Длительность: {file.duration}
        </p>
      </div>

      <div className="p-4 sm:p-5 pt-3 border-t border-neutral-100 space-y-4">
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={1}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="Перемотка аудиозаписи"
              className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900 focus-visible:outline-none"
            />
          </div>

          <div className="flex justify-between text-xs text-neutral-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{file.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => handleSkip(-5)}
            className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-100"
            title="Назад на 5 секунд"
            aria-label="Назад на 5 секунд"
          >
            <BackwardIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
            className="w-13 h-13 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-all shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6 translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSkip(5)}
            className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-100"
            title="Вперед на 5 секунд"
            aria-label="Вперед на 5 секунд"
          >
            <ForwardIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="inline-flex p-0.5 bg-neutral-100 rounded-lg text-xs font-mono font-medium">
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  playbackRate === rate
                    ? 'bg-white text-neutral-900 font-bold shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <span className="text-[11px] text-neutral-400 font-mono">
            {formatTime(currentTime)} / {file.duration}
          </span>
        </div>
      </div>
    </div>
  )
}
