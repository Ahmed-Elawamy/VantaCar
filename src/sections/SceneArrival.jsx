import { useLang } from '../lib/LangContext'

export default function SceneArrival() {
  const { t } = useLang()
  const c = t.chapters.arrival

  return (
    <section data-scene="0" className="scene-section relative h-screen w-full">
      <div className="flex h-full flex-col items-center justify-between px-6 pt-24 pb-12 md:px-12 md:pt-28 md:pb-16">
        {/* Top label */}
        <div className="flex items-center gap-3 opacity-90">
          <span className="h-px w-8 bg-accent/50" />
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-accent-soft md:text-[11px]">
            {c.label}
          </span>
          <span className="h-px w-8 bg-accent/50" />
        </div>

        {/* Bottom content */}
        <div className="flex w-full flex-col items-start gap-5 md:gap-7">
          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {c.headline1}
            <br />
            <span className="text-gradient">{c.headline2}</span>
          </h1>

          <p className="max-w-md text-sm font-light leading-relaxed text-neutral-400 md:text-base">
            {c.sub}
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <button className="group relative overflow-hidden border border-white/20 bg-white/5 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10">
              <span className="relative z-10">{c.cta}</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <div className="flex items-center gap-3">
              <span className="animate-pulse-soft text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
                {c.scroll}
              </span>
              <span className="h-8 w-px bg-gradient-to-b from-neutral-500 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
