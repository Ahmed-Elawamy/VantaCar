import { useLang } from '../lib/LangContext'

export default function SceneDriverSpace() {
  const { t } = useLang()
  const c = t.chapters.driver

  return (
    <section data-scene="3" className="scene-section relative h-screen w-full">
      <div className="flex h-full items-center justify-end px-6 md:px-12 lg:px-20">
        <div className="max-w-lg text-right rtl:text-left">
          <span className="mb-4 block text-[10px] font-medium uppercase tracking-[0.3em] text-accent-soft">
            {c.chapter}
          </span>
          <h2 className="font-display text-4xl font-semibold leading-[1.0] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {c.headline}
          </h2>
          <div className="mt-5 space-y-1 md:mt-7">
            <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub1}</p>
            <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub2}</p>
          </div>

          {/* Driver moments */}
          <div className="mt-10 flex flex-col gap-5 md:mt-14">
            {c.moments.map((m) => (
              <div key={m.tag} className="flex gap-3 justify-end rtl:justify-start rtl:flex-row-reverse">
                <div className="text-right rtl:text-left">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-xs font-light leading-relaxed text-neutral-500">
                    {m.text}
                  </p>
                </div>
                <span className="font-mono text-[10px] font-medium text-accent/60">{m.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
