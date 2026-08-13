import { useLang } from '../../lib/LangContext'

export default function Navigation({ activeScene, onNavClick }) {
  const { t, lang, toggle } = useLang()

  const navItems = [
    { label: t.nav.experience, scene: 0 },
    { label: t.nav.design, scene: 1 },
    { label: t.nav.performance, scene: 2 },
    { label: t.nav.details, scene: 4 },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="grain-overlay relative flex items-center justify-between px-6 py-5 md:px-12 md:py-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-graphite-950/90 via-graphite-950/50 to-transparent" />

        <button
          onClick={() => onNavClick?.(0)}
          className="relative z-10 font-display text-xl font-semibold tracking-[0.15em] text-white transition-opacity hover:opacity-80 md:text-2xl"
        >
          VANTA
        </button>

        <div className="relative z-10 hidden items-center gap-10 lg:flex">
          {navItems.map((item) => {
            const isActive = activeScene === item.scene
            return (
              <button
                key={item.label}
                onClick={() => onNavClick?.(item.scene)}
                className={`group relative text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            )
          })}
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center gap-1.5 border border-graphite-700 px-2.5 py-1.5">
            <button
              onClick={() => lang !== 'en' && toggle()}
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${
                lang === 'en' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              EN
            </button>
            <span className="text-graphite-600">/</span>
            <button
              onClick={() => lang !== 'ar' && toggle()}
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${
                lang === 'ar' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
