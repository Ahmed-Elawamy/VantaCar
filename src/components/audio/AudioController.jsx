import { useEffect, useRef } from 'react'

/**
 * Audio curve definition matching the chapters:
 * 0.0 - 0.14 ARRIVAL: silence -> subtle ambient
 * 0.14 - 0.28 DESIGN: minimal texture
 * 0.28 - 0.42 PERFORMANCE: engine presence (loudest)
 * 0.42 - 0.57 DRIVER'S SPACE: intimate/restrained
 * 0.57 - 0.71 DETAILS: very quiet
 * 0.71 - 1.0 FINAL REVEAL: fades to silence
 */
const AUDIO_KEYFRAMES = [
  { p: 0.00, vol: 0.05 },
  { p: 0.14, vol: 0.15 },
  { p: 0.28, vol: 0.50 },
  { p: 0.42, vol: 0.20 },
  { p: 0.57, vol: 0.10 },
  { p: 0.71, vol: 0.25 },
  { p: 0.85, vol: 0.00 },
  { p: 1.00, vol: 0.00 },
]

function getTargetVolume(progress) {
  for (let i = 0; i < AUDIO_KEYFRAMES.length - 1; i++) {
    const kf0 = AUDIO_KEYFRAMES[i]
    const kf1 = AUDIO_KEYFRAMES[i + 1]
    if (progress >= kf0.p && progress <= kf1.p) {
      const span = kf1.p - kf0.p
      const t = span > 0 ? (progress - kf0.p) / span : 0
      // Smoothstep for volume
      const smoothT = t * t * (3 - 2 * t)
      return kf0.vol + (kf1.vol - kf0.vol) * smoothT
    }
  }
  return 0
}

export default function AudioController({ scrollProgress, isSoundOn }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) return
    
    if (isSoundOn) {
      audioRef.current.play().catch(() => {
        // Autoplay policy might block it, handled gracefully
      })
    } else {
      audioRef.current.pause()
    }
  }, [isSoundOn])

  useEffect(() => {
    if (!audioRef.current) return
    const targetVol = getTargetVolume(scrollProgress)
    
    // Ensure volume is between 0 and 1
    const clampedVol = Math.max(0, Math.min(1, targetVol))
    
    if (isSoundOn) {
      audioRef.current.volume = clampedVol
    }
  }, [scrollProgress, isSoundOn])

  return (
    <audio
      ref={audioRef}
      src="/audio/cinematic-ambient.mp3"
      loop
      preload="auto"
    />
  )
}
