/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'

const AUDIO_FILES = {
  start: '/audio/car%20engine%20start.mp3',
  wind: '/audio/Car%20Driving%20Wind.mp3',
  acceleration: '/audio/sports%20car%20acceleration.mp3',
  rev: '/audio/car%20engine%20rev.mp3',
}

const CHAPTER_VOLUMES = {
  0: { wind: 0.00, acceleration: 0.02 },
  1: { wind: 0.15, acceleration: 0.02 },
  2: { wind: 0.25, acceleration: 0.55 },
  3: { wind: 0.05, acceleration: 0.05 },
  4: { wind: 0.02, acceleration: 0.00 },
  5: { wind: 0.00, acceleration: 0.12 },
}

// Audio is activated imperatively from the user's click handler. The mounted
// elements are reused for the lifetime of the page; chapter changes only mix.
const AudioController = forwardRef(function AudioController(
  { activeScene, isSoundOn, scrollProgress },
  ref
) {
  const startRef = useRef(null)
  const windRef = useRef(null)
  const accelerationRef = useRef(null)
  const revRef = useRef(null)
  const isUnlocked = useRef(false)
  const hasPlayedEngineStart = useRef(false)
  const hasPlayedPerformanceRev = useRef(false)
  const hasPlayedFinalRev = useRef(false)
  const activationPromise = useRef(null)
  const previousScene = useRef(activeScene)
  const activeSceneRef = useRef(activeScene)

  useEffect(() => { activeSceneRef.current = activeScene }, [activeScene])

  useImperativeHandle(ref, () => ({
    activate(chapter) {
      if (isUnlocked.current) return Promise.resolve()
      if (activationPromise.current) return activationPromise.current
      const playPromises = []
      const play = (audio) => {
        if (!audio) return Promise.resolve()
        const result = audio.play()
        return result && typeof result.then === 'function' ? result : Promise.resolve()
      }

      if (chapter === 0 && !hasPlayedEngineStart.current && startRef.current) {
        startRef.current.currentTime = 0
        startRef.current.volume = 0.4
        hasPlayedEngineStart.current = true
        playPromises.push(play(startRef.current))
      }
      if (windRef.current) {
        windRef.current.volume = 0
        playPromises.push(play(windRef.current))
      }
      if (accelerationRef.current) {
        accelerationRef.current.volume = 0
        playPromises.push(play(accelerationRef.current))
      }

      if (chapter === 2 && !hasPlayedPerformanceRev.current) {
        fireRevAccent(0.35)
        hasPlayedPerformanceRev.current = true
      }
      if (chapter === 5 && !hasPlayedFinalRev.current) {
        fireRevAccent(0.15)
        hasPlayedFinalRev.current = true
      }

      previousScene.current = chapter
      activationPromise.current = Promise.all(playPromises).then(() => {
        isUnlocked.current = true
        applyChapterVolumes(chapter)
      }).catch((error) => {
        if (chapter === 0) hasPlayedEngineStart.current = false
        throw error
      }).finally(() => {
        activationPromise.current = null
      })
      return activationPromise.current
    },
  }), [])

  useEffect(() => {
    if (!isUnlocked.current || !isSoundOn) return
    if (activeScene === 2 && previousScene.current !== 2 && !hasPlayedPerformanceRev.current) {
      fireRevAccent(0.35)
      hasPlayedPerformanceRev.current = true
    }
    if (activeScene === 5 && previousScene.current !== 5 && !hasPlayedFinalRev.current) {
      fireRevAccent(0.15)
      hasPlayedFinalRev.current = true
    }
    previousScene.current = activeScene
    applyChapterVolumes(activeScene)
  }, [activeScene, isSoundOn])

  useEffect(() => {
    if (!isUnlocked.current) return
    if (isSoundOn) resumeChapter(activeSceneRef.current)
    else fadeOutAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSoundOn])

  useEffect(() => {
    if (!isUnlocked.current || !isSoundOn || activeScene !== 5) return
    if (scrollProgress > 0.85) {
      const fade = Math.max(0, 1 - ((scrollProgress - 0.85) / 0.12))
      if (accelerationRef.current) accelerationRef.current.volume = 0.12 * fade
      if (windRef.current) windRef.current.volume = 0.02 * fade
    }
  }, [scrollProgress, activeScene, isSoundOn])

  function fireRevAccent(volume) {
    if (!revRef.current) return
    revRef.current.currentTime = 0
    revRef.current.volume = volume
    revRef.current.play().catch(() => {})
  }

  function resumeChapter(chapter) {
    if (windRef.current?.paused) windRef.current.play().catch(() => {})
    if (accelerationRef.current?.paused) accelerationRef.current.play().catch(() => {})
    applyChapterVolumes(chapter)
  }

  function fadeOutAll() {
    ;[windRef, accelerationRef, startRef, revRef].forEach((audioRef) => {
      if (!audioRef.current) return
      gsap.to(audioRef.current, {
        volume: 0,
        duration: 1,
        overwrite: 'auto',
        onComplete: () => audioRef.current?.pause(),
      })
    })
  }

  function applyChapterVolumes(chapter) {
    const target = CHAPTER_VOLUMES[chapter] ?? { wind: 0, acceleration: 0 }
    if (windRef.current) gsap.to(windRef.current, {
      volume: target.wind, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto',
    })
    if (accelerationRef.current) gsap.to(accelerationRef.current, {
      volume: target.acceleration, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto',
    })
  }

  return (
    <>
      <audio ref={startRef} src={AUDIO_FILES.start} preload="metadata" />
      <audio ref={windRef} src={AUDIO_FILES.wind} preload="none" loop />
      <audio ref={accelerationRef} src={AUDIO_FILES.acceleration} preload="none" loop />
      <audio ref={revRef} src={AUDIO_FILES.rev} preload="none" />
    </>
  )
})

export default AudioController
