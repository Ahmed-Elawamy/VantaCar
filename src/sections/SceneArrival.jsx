/* eslint-disable react/prop-types */
import { useLang } from '../lib/LangContext'

export default function SceneArrival({ audioEnabled, onEnableSound, onExplore }) {
  const { t } = useLang()
  const c = t.chapters.arrival

  return (
    <section data-scene="0" className="scene-section relative h-screen w-full">
      <div className="flex h-full flex-col items-start justify-between px-6 pt-24 pb-12 md:px-12 md:pt-28 md:pb-16 lg:px-20">
        {/* Top label */}
        <div data-reveal-item className="flex items-center gap-3 opacity-90">
          <span className="h-px w-8 bg-accent/50" />
          <span className="micro-label text-[10px] uppercase text-accent-soft md:text-[11px]">
            {c.label}
          </span>
          <span className="h-px w-8 bg-accent/50" />
        </div>

        {/* Bottom content */}
        <div className="flex w-full max-w-xl flex-col items-start gap-5 rtl:text-right md:gap-6 lg:max-w-2xl">
          <h1 data-reveal-item className="max-w-[9ch] font-display text-5xl font-semibold leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {c.headline1}
            <br />
            <span className="text-gradient">{c.headline2}</span>
          </h1>

          <p data-reveal-item className="max-w-xs text-sm font-light leading-relaxed text-neutral-400 md:text-base">
            {c.sub}
          </p>

          <div data-reveal-item className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <button
              onClick={audioEnabled ? onExplore : onEnableSound}
              className="group relative overflow-hidden border border-white/20 bg-white/5 px-8 py-3.5 text-[11px] font-semibold uppercase text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              <span className="relative z-10">{audioEnabled ? c.cta : c.enableSound}</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            <div className="flex items-center gap-3">
              <span className="micro-label animate-pulse-soft text-[10px] uppercase text-neutral-500">
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
