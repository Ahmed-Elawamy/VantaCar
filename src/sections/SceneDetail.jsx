import { useLang } from '../lib/LangContext'

export default function SceneDetail() {
  const { t } = useLang()
  const c = t.chapters.details

  return (
    <section data-scene="4" className="scene-section relative h-screen w-full">
      <div className="flex h-full items-end px-6 pb-16 md:px-12 md:pb-20 lg:px-20">
        <div className="max-w-xl">
          <span className="mb-3 block text-[10px] font-medium uppercase tracking-[0.3em] text-accent-soft">
            {c.chapter}
          </span>
          <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {c.headline}
          </h2>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-neutral-400 md:mt-5 md:text-base">
            {c.sub}
          </p>

          {/* Detail moments */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 md:mt-10">
            {c.moments.map((m) => (
              <div key={m.tag} className="flex gap-2.5">
                <span className="font-mono text-[10px] font-medium text-accent/60">{m.tag}</span>
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                    {m.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-light leading-relaxed text-neutral-500">
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
