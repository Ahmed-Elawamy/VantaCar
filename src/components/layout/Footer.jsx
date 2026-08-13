import { useLang } from '../../lib/LangContext'

export default function Footer({ onNavClick }) {
  const { t } = useLang()

  const navItems = [
    { label: t.footer.nav.experience, scene: 0 },
    { label: t.footer.nav.design, scene: 1 },
    { label: t.footer.nav.performance, scene: 2 },
    { label: t.footer.nav.details, scene: 4 },
  ]

  return (
    <footer className="relative z-30 border-t border-graphite-800 bg-graphite-950 px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="font-display text-2xl font-semibold tracking-[0.15em] text-white">
              VANTA
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">
              {t.footer.tagline}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-600">
              Menu
            </span>
            {navItems.map((item) => (
              <button
                key={item.scene}
                onClick={() => onNavClick?.(item.scene)}
                className="group flex items-center gap-2 text-left rtl:text-right text-sm text-neutral-400 transition-colors hover:text-white"
              >
                <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-600">
              {t.footer.social}
            </span>
            {['Instagram', 'YouTube', 'X'].map((s) => (
              <a
                key={s}
                href="#"
                className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
              >
                <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
                {s}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-600">
              {t.footer.langLabel}
            </span>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <span className="text-white">EN</span>
              <span className="text-graphite-600">/</span>
              <span>AR</span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 border-t border-graphite-800 pt-12 md:mt-20">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-600">
            {t.footer.credit}
          </span>
          <span className="font-display text-lg font-semibold tracking-[0.1em] text-white">
            {t.footer.creditName}
          </span>
        </div>

        <div className="mt-8 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600">
            {t.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  )
}
