import { useLang } from '../lib/LangContext'

export default function SceneDriverSpace() {
  const { t } = useLang()
  const c = t.chapters.driver

  return (
    <section data-scene="3" className="scene-section relative h-screen w-full">
      <div className="flex h-full items-center justify-end px-6 md:px-12 lg:px-20">
        <div className="max-w-md text-right rtl:text-left">
          <span className="micro-label mb-4 block text-[10px] uppercase text-accent-soft">
            {c.chapter}
          </span>
          <h2 className="font-display text-3xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
            {c.headline}
          </h2>
          <div className="mt-5 space-y-1 md:mt-7">
            <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub1}</p>
            <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub2}</p>
          </div>

          {/* Driver moments */}
          <div className="mt-12 flex flex-col gap-7 border-r border-graphite-700 pr-5 md:mt-16">
            {c.moments.map((m) => (
              <div key={m.tag} className="moment-item flex gap-3 justify-end rtl:justify-start rtl:flex-row-reverse">
                <div className="text-right rtl:text-left">
                <h3 className="callout-title text-[11px] uppercase">
                    {m.title}
                  </h3>
                <p className="callout-description mt-1">
                    {m.text}
                  </p>
                </div>
                <span className="micro-label font-mono text-[10px] text-accent/60">{m.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
