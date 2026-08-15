/* eslint-disable react/prop-types */
import { useLang } from '../../lib/LangContext'

export default function ProgressIndicator({ activeScene, scrollProgress }) {
  const { t } = useLang()
  const total = t.progress.scenes.length
  const current = activeScene + 1
  const sceneLabel = t.progress.scenes[activeScene] || ''

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-40 flex flex-col gap-2 md:bottom-8 md:left-8">
      <div className="flex items-baseline gap-2">
        <span className="micro-label font-display text-2xl text-white md:text-3xl">
          {String(current).padStart(2, '0')}
        </span>
        <span className="micro-label text-sm text-neutral-500">
          / {String(total).padStart(2, '0')}
        </span>
      </div>

      <span className="micro-label text-[10px] uppercase text-neutral-500">
        {sceneLabel}
      </span>

      <div className="mt-1 h-px w-24 overflow-hidden bg-graphite-700 md:w-32">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-soft transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </div>
  )
}
