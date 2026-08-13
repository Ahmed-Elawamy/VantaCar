import { useLang } from '../lib/LangContext'

export default function ScenePerformance() {
  const { t } = useLang()
  const c = t.chapters.performance

  return (
    <section data-scene="2" className="scene-section relative h-screen w-full">
      <div className="flex h-full flex-col items-center justify-center px-6 md:px-12">
        <span className="mb-4 block text-[10px] font-medium uppercase tracking-[0.3em] text-accent-soft">
          {c.chapter}
        </span>
        <h2 className="font-display text-4xl font-semibold leading-[1.0] tracking-tight text-center text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {c.headline}
        </h2>
        <div className="mt-4 space-y-1 text-center md:mt-6">
          <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub1}</p>
          <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub2}</p>
        </div>

        {/* Power / Response / Precision */}
        <div className="mt-12 flex flex-col items-center gap-8 md:mt-16 md:flex-row md:gap-12 lg:gap-20">
          {c.words.map((w, i) => (
            <div key={w.num} className="flex flex-col items-center text-center">
              <span className="font-mono text-[10px] font-medium text-accent/50">{w.num}</span>
              <span className="mt-2 font-display text-2xl font-semibold tracking-wide text-white/90 md:text-3xl lg:text-4xl">
                {w.word}
              </span>
              <span className="mt-2 text-[11px] font-light text-neutral-500">{w.text}</span>
              {i < c.words.length - 1 && (
                <span className="mt-6 hidden h-12 w-px bg-graphite-600 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
