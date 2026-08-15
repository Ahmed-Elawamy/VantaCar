import { useLang } from '../lib/LangContext'

export default function ScenePerformance() {
  const { t } = useLang()
  const c = t.chapters.performance

  return (
    <section data-scene="2" className="scene-section relative h-screen w-full">
      <div className="flex h-full flex-col items-start justify-center px-6 md:px-12 lg:px-24">
        <span data-reveal-item className="micro-label mb-4 block text-[10px] uppercase text-accent-soft">
          {c.chapter}
        </span>
        <h2 data-reveal-item className="max-w-[10ch] font-display text-4xl font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {c.headline}
        </h2>
        <div data-reveal-item className="mt-4 max-w-sm space-y-1 md:mt-6">
          <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub1}</p>
          <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub2}</p>
        </div>

        {/* Power / Response / Precision */}
        <div className="mt-12 flex flex-col items-start gap-6 border-l border-accent/30 pl-5 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-5 md:mt-16 md:gap-7">
          {c.words.map((w) => (
            <div key={w.num} className="moment-item flex flex-col items-start text-left rtl:text-right">
              <span className="micro-label font-mono text-[10px] text-accent/50">{w.num}</span>
              <span className="callout-title mt-1 font-display text-2xl md:text-3xl lg:text-4xl">
                {w.word}
              </span>
              <span className="callout-description mt-1 max-w-xs text-[11px]">{w.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
