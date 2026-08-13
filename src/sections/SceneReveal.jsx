import { useLang } from '../lib/LangContext'

export default function SceneReveal() {
  const { t } = useLang()
  const c = t.chapters.reveal

  return (
    <section data-scene="5" className="scene-section relative h-screen w-full">
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 block text-[10px] font-medium uppercase tracking-[0.3em] text-accent-soft">
          {c.chapter}
        </span>
        <h2 className="font-display text-4xl font-semibold leading-[1.0] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {c.headline1}
          <br />
          <span className="text-gradient">{c.headline2}</span>
        </h2>
        <div className="mt-5 space-y-1 md:mt-7">
          <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub1}</p>
          <p className="text-sm font-light text-neutral-400 md:text-base">{c.sub2}</p>
        </div>

        {/* Final reveal headline */}
        <div className="mt-14 md:mt-20">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {c.finalHeadline}
          </h3>
          <p className="mt-3 text-sm font-light text-neutral-500 md:text-base">
            {c.finalSub}
          </p>
        </div>

        <button className="group relative mt-10 overflow-hidden border border-white/20 bg-white/5 px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 md:mt-12">
          <span className="relative z-10">{c.cta}</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>
    </section>
  )
}
