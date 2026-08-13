import { useLang } from '../lib/LangContext'

export default function SceneDesign() {
  const { t } = useLang()
  const c = t.chapters.design

  return (
    <section data-scene="1" className="scene-section relative h-screen w-full">
      <div className="flex h-full items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-xl">
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

          {/* Design moments */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 md:mt-14">
            {c.moments.map((m) => (
              <div key={m.tag} className="flex gap-3">
                <span className="font-mono text-[10px] font-medium text-accent/60">{m.tag}</span>
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-xs font-light leading-relaxed text-neutral-500">
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
