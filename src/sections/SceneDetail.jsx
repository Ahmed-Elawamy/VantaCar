import { useLang } from '../lib/LangContext'

export default function SceneDetail() {
  const { t } = useLang()
  const c = t.chapters.details

  return (
    <section data-scene="4" className="scene-section relative h-screen w-full">
      <div className="flex h-full items-end px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
        <div className="max-w-md">
          <span className="micro-label mb-3 block text-[10px] uppercase text-accent-soft">
            {c.chapter}
          </span>
          <h2 className="max-w-sm font-display text-3xl font-semibold leading-[1.0] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
            {c.headline}
          </h2>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-neutral-400 md:mt-5 md:text-base">
            {c.sub}
          </p>

          {/* Detail moments */}
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 md:mt-14">
            {c.moments.map((m) => (
              <div key={m.tag} className="moment-item flex gap-2.5">
                <span className="micro-label font-mono text-[10px] text-accent/60">{m.tag}</span>
                <div>
                  <h3 className="callout-title text-[10px] uppercase">
                    {m.title}
                  </h3>
                  <p className="callout-description mt-0.5 text-[11px]">
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
