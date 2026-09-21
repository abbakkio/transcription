export function Header() {
  return (
    <header className="mt-12 sm:mt-18 flex flex-col items-center px-4 w-full text-center">
      <div className="relative isolate inline-flex items-center justify-center">
        <h1 className="relative z-10 text-[22px] sm:text-4xl md:text-5xl font-bold tracking-tight px-3 sm:px-4 [text-shadow:0_0_6px_#fff,0_0_12px_#fff,0_0_20px_rgba(255,255,255,0.9)]">
          Транскрибация текста
        </h1>
      </div>

      <p className="mt-3.5 text-xs sm:text-sm text-neutral-500 max-w-xs sm:max-w-md px-2 leading-relaxed">
        Быстрое и точное автоматическое распознавание казахской и русской речи
      </p>
    </header>
  )
}
