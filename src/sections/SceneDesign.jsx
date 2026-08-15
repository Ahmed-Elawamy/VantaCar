import { useLang } from '../lib/LangContext'

export default function SceneDesign() {
  const { t } = useLang()
  const c = t.chapters.design

  return (
    <section data-scene="1" className="scene-section relative h-screen w-full">
      <div className="flex h-full items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-lg lg:ml-8">
          <span className="micro-label mb-4 block text-[10px] uppercase text-accent-soft">
            {c.chapter}
          </span>
          <h2 className="max-w-md font-display text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {c.headline}
          </h2>
          <div className="mt-5 space-y-1 md:mt-7">
            <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub1}</p>
            <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub2}</p>
          </div>

          {/* Design moments */}
          <div className="mt-12 grid max-w-xl grid-cols-1 gap-x-10 gap-y-6 border-l border-graphite-700 pl-5 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-5 sm:grid-cols-2 md:mt-16">
            {c.moments.map((m) => (
              <div key={m.tag} className="moment-item flex gap-3">
                <span className="micro-label font-mono text-[10px] text-accent/60">{m.tag}</span>
                <div>
                  <h3 className="callout-title text-[11px] uppercase">
                    {m.title}
                  </h3>
                  <p className="callout-description mt-1">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
