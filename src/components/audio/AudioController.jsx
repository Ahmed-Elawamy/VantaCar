import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import gsap from 'gsap'

// AudioController manages the cinematic audio experience.
//
// ACTIVATION:
//   The parent calls audioControllerRef.current.activate(chapter) directly
//   inside the ENABLE SOUND click handler — synchronously, within the
//   browser's user-activation context. This guarantees audio.play() is called
//   within the same event stack as the user gesture.
//
// ONGOING CHOREOGRAPHY:
//   After activation, chapter transitions and mute/unmute are driven by
//   React effects that check isUnlocked.current before acting.

// eslint-disable-next-line react/prop-types
const AudioController = forwardRef(function AudioController(
  { scrollProgress, activeScene, isSoundOn },
  ref
) {
  const startRef = useRef(null)
  const windRef  = useRef(null)
  const accelRef = useRef(null)
  const revRef   = useRef(null)

  // All control state lives in refs — no re-renders from inside this component
  const isUnlocked           = useRef(false) // Has the user clicked ENABLE SOUND?
  const hasPlayedEngineStart = useRef(false) // Engine Start fires exactly once
  const hasPlayedPerfRev     = useRef(false) // Performance Rev fires exactly once
  const hasPlayedFinalRev    = useRef(false) // Final Reveal Rev fires exactly once
  const prevScene            = useRef(-1)    // Previous chapter for transition detection

  // Stable prop mirrors — prevent stale closures in callbacks
  const isSoundOnRef   = useRef(isSoundOn)
  const activeSceneRef = useRef(activeScene)
  useEffect(() => { isSoundOnRef.current   = isSoundOn  }, [isSoundOn])
  useEffect(() => { activeSceneRef.current = activeScene }, [activeScene])

  // ─────────────────────────────────────────────────────────────────────────────
  // IMPERATIVE ACTIVATION — the only audio initialization path
  //
  // Called directly from handleEnableSound() in App.jsx, which itself runs
  // synchronously inside the browser click event. This keeps audio.play() inside
  // the user-activation context — no useEffect delay, no second click.
  //
  // Duplicate-call guard: if isUnlocked is already true, this is a no-op.
  // ─────────────────────────────────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    activate(chapter) {
      if (isUnlocked.current) return        // Guard — called at most once
      isUnlocked.current = true

      if (!isSoundOnRef.current) return     // Unlocked but muted — no playback

      // ── Chapter 0 (ARRIVAL): Engine Start — the ignition moment ────────────
      if (chapter === 0 && !hasPlayedEngineStart.current) {
        if (startRef.current) {
          startRef.current.currentTime = 0
          startRef.current.volume = 0.4
          startRef.current.play().catch(() => {})
          hasPlayedEngineStart.current = true
        }
      }

      // ── Chapter 2 (PERFORMANCE): cinematic rev accent on entry ─────────────
      if (chapter === 2 && !hasPlayedPerfRev.current) {
        _fireRevAccent(0.35)
        hasPlayedPerfRev.current = true
      }

      // ── Chapter 5 (FINAL REVEAL): optional cinematic rev accent ───────────
      if (chapter === 5 && !hasPlayedFinalRev.current) {
        _fireRevAccent(0.15)
        hasPlayedFinalRev.current = true
      }

      // ── Start looping presence tracks at zero (GSAP ramps them up) ─────────
      if (windRef.current)  { windRef.current.volume  = 0; windRef.current.play().catch(() => {}) }
      if (accelRef.current) { accelRef.current.volume = 0; accelRef.current.play().catch(() => {}) }

      // ── Set cinematic volumes for the chapter the user is currently in ──────
      _applyChapterVolumes(chapter)
    },
  }), []) // Empty deps — all access is through stable refs, no stale closure risk

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER CHOREOGRAPHY
  // Runs on every chapter change AFTER activation. One-shot guards prevent
  // rev accents from firing again even if the user re-enters the same chapter.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isUnlocked.current || !isSoundOn) return

    // One-shot rev accent: Performance chapter entry
    if (activeScene === 2 && prevScene.current !== 2 && !hasPlayedPerfRev.current) {
      _fireRevAccent(0.35)
      hasPlayedPerfRev.current = true
    }
    // One-shot rev accent: Final Reveal entry
    if (activeScene === 5 && prevScene.current !== 5 && !hasPlayedFinalRev.current) {
      _fireRevAccent(0.15)
      hasPlayedFinalRev.current = true
    }
    prevScene.current = activeScene

    _applyChapterVolumes(activeScene)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene, isSoundOn])

  // ─────────────────────────────────────────────────────────────────────────────
  // SOUND TOGGLE — mute / unmute only
  // Engine Start NEVER replays. The chapter position is preserved.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isUnlocked.current) return // Ignore before ENABLE SOUND is clicked

    if (isSoundOn) {
      _resumeChapter(activeSceneRef.current)
    } else {
      _fadeOutAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSoundOn])

  // ─────────────────────────────────────────────────────────────────────────────
  // SCROLL-TIED SILENCE — Chapter 5 (FINAL REVEAL) only
  // Gradually fades all audio to complete silence as the user scrolls deeper.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isUnlocked.current || !isSoundOn || activeScene !== 5) return
    if (scrollProgress > 0.85) {
      const fade = Math.max(0, 1 - ((scrollProgress - 0.85) / 0.12))
      if (accelRef.current) accelRef.current.volume = 0.12 * fade
      if (windRef.current)  windRef.current.volume  = 0.02 * fade
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress, activeScene, isSoundOn])

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS — access refs directly; no React state involved
  // ─────────────────────────────────────────────────────────────────────────────

  function _fireRevAccent(vol) {
    if (!revRef.current) return
    revRef.current.currentTime = 0
    revRef.current.volume = vol
    revRef.current.play().catch(() => {})
  }

  function _resumeChapter(scene) {
    // Resume looping tracks that were paused by _fadeOutAll()
    if (windRef.current?.paused)  windRef.current.play().catch(() => {})
    if (accelRef.current?.paused) accelRef.current.play().catch(() => {})
    _applyChapterVolumes(scene)
  }

  function _fadeOutAll() {
    ;[windRef, accelRef, startRef, revRef].forEach((r) => {
      if (r.current) {
        gsap.to(r.current, {
          volume: 0,
          duration: 1.0,
          overwrite: 'auto',
          onComplete: () => r.current?.pause(),
        })
      }
    })
  }

  function _applyChapterVolumes(scene) {
    // Cinematic intensity map — wind and acceleration layers per chapter
    const map = {
      0: { wind: 0.00, accel: 0.02 }, // ARRIVAL       — subtle engine presence
      1: { wind: 0.15, accel: 0.02 }, // DESIGN        — wind of motion
      2: { wind: 0.25, accel: 0.55 }, // PERFORMANCE   — full power
      3: { wind: 0.05, accel: 0.05 }, // DRIVER'S SPACE — intimate control
      4: { wind: 0.02, accel: 0.00 }, // DETAILS       — near silence
      5: { wind: 0.00, accel: 0.12 }, // FINAL REVEAL  — subtle → fades to 0
    }
    const t = map[scene] ?? { wind: 0, accel: 0 }
    if (windRef.current)
      gsap.to(windRef.current,  { volume: t.wind,  duration: 1.5, ease: 'power2.inOut', overwrite: 'auto' })
    if (accelRef.current)
      gsap.to(accelRef.current, { volume: t.accel, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto' })
  }

  return (
    <>
      <audio ref={startRef} src="/audio/car%20engine%20start.mp3"        preload="auto" />
      <audio ref={windRef}  src="/audio/Car%20Driving%20Wind.mp3"        preload="auto" loop />
      <audio ref={accelRef} src="/audio/sports%20car%20acceleration.mp3" preload="auto" loop />
      <audio ref={revRef}   src="/audio/car%20engine%20rev.mp3"          preload="auto" />
    </>
  )
})

export default AudioController


  const startRef = useRef(null)
  const windRef  = useRef(null)
  const accelRef = useRef(null)
  const revRef   = useRef(null)

  // All state in refs — zero re-renders from inside this component
  const isUnlocked     = useRef(false) // Has the AudioContext / first-gesture been granted?
  const hasIgnited     = useRef(false) // Has the one-shot engine start fired?
  const prevScene      = useRef(activeScene)
  const isSoundOnRef   = useRef(isSoundOn)
  const activeSceneRef = useRef(activeScene)

  // Keep prop-mirrors in sync so event handlers always read fresh values
  useEffect(() => { isSoundOnRef.current   = isSoundOn },   [isSoundOn])
  useEffect(() => { activeSceneRef.current = activeScene },  [activeScene])

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. AUTOPLAY ATTEMPT — fires the moment the experience becomes ready
  //
  //    Sequence:
  //      Loading overlay visible  →  NO audio (this effect never runs)
  //      isReady flips true       →  loading overlay disappears
  //                               →  immediately attempt Engine Start autoplay
  //
  //    If the browser allows autoplay  → Engine Start plays automatically.
  //    If the browser blocks autoplay  → we attach one-time fallback listeners
  //      on natural interactions (wheel / touch / pointer). The user never needs
  //      to press "Sound On"; scrolling alone is enough to unlock audio.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return                // Strict: nothing happens while loading
    if (isUnlocked.current) return      // Already running — nothing to do

    if (!isSoundOnRef.current) {
      // Sound is OFF at load time — attach fallback so we're ready if sound is
      // toggled on after the first natural interaction.
      _attachFallbackListeners()
      return
    }

    // ── Attempt immediate autoplay ──────────────────────────────────────────
    // Set volume before play() so even if it resolves synchronously it's audible
    if (startRef.current) startRef.current.volume = 0.4

    const promise = startRef.current?.play()

    if (promise !== undefined) {
      promise
        .then(() => {
          // Browser allowed autoplay ✓
          isUnlocked.current = true
          hasIgnited.current = true
          // Start looping presence tracks at near-zero so volumes ramp up smoothly
          if (windRef.current)  { windRef.current.volume  = 0; windRef.current.play().catch(() => {}) }
          if (accelRef.current) { accelRef.current.volume = 0; accelRef.current.play().catch(() => {}) }
          _applyChapterVolumes(activeSceneRef.current)
        })
        .catch(() => {
          // Browser blocked audible autoplay — attach natural-interaction fallback
          _attachFallbackListeners()
        })
    } else {
      // Non-promise path (very old browsers) — attach fallback to be safe
      _attachFallbackListeners()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. SOUND ON / OFF TOGGLING (only after unlock + ready)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isUnlocked.current) return // Ignore until first gesture / autoplay has happened

    if (isSoundOn) {
      // Resume current chapter audio. Ignition does NOT replay.
      _resumeChapter(activeSceneRef.current)
    } else {
      _fadeOutAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSoundOn])

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CHAPTER-BASED VOLUME CHOREOGRAPHY
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isUnlocked.current || !isSoundOn) return

    // One-shot rev accent on chapter entry
    if (activeScene === 2 && prevScene.current !== 2) _fireRevAccent(0.35)
    if (activeScene === 5 && prevScene.current !== 5) _fireRevAccent(0.15)
    prevScene.current = activeScene

    _applyChapterVolumes(activeScene)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScene, isSoundOn])

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. SCROLL-TIED FINAL SILENCE (Chapter 5 only)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isUnlocked.current || !isSoundOn || activeScene !== 5) return
    if (scrollProgress > 0.85) {
      const fade = Math.max(0, 1 - ((scrollProgress - 0.85) / 0.12))
      if (accelRef.current) accelRef.current.volume = 0.15 * fade
      if (windRef.current)  windRef.current.volume  = 0.02 * fade
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress, activeScene, isSoundOn])

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS — pure functions, no side-effects on React state
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Attach one-time fallback listeners to natural user interactions.
   * Scrolling (wheel) is the primary trigger — no dedicated button needed.
   * Listeners are removed the moment any one of them fires.
   */
  function _attachFallbackListeners() {
    const EVENTS = ['wheel', 'touchstart', 'pointerdown']

    const handleFirstInteraction = () => {
      if (isUnlocked.current) return
      isUnlocked.current = true

      // Remove all listeners immediately — one-shot, no memory leaks
      EVENTS.forEach(evt => window.removeEventListener(evt, handleFirstInteraction))

      // Only start audio if sound is currently enabled
      if (isSoundOnRef.current) {
        _startExperience()
      }
    }

    EVENTS.forEach(evt =>
      window.addEventListener(evt, handleFirstInteraction, { passive: true })
    )
  }

  function _startExperience() {
    // Fire ignition exactly once
    if (!hasIgnited.current && startRef.current) {
      startRef.current.currentTime = 0
      startRef.current.volume = 0.4
      startRef.current.play().catch(() => {})
      hasIgnited.current = true
    }
    // Start looping presence tracks at near-zero so volumes ramp up smoothly
    if (windRef.current)  { windRef.current.volume  = 0; windRef.current.play().catch(() => {}) }
    if (accelRef.current) { accelRef.current.volume = 0; accelRef.current.play().catch(() => {}) }
    // Apply correct chapter volumes immediately (GSAP ramp)
    _applyChapterVolumes(activeSceneRef.current)
  }

  function _resumeChapter(scene) {
    // Re-play looping tracks (they were paused when Sound was toggled off)
    windRef.current?.play().catch(() => {})
    accelRef.current?.play().catch(() => {})
    _applyChapterVolumes(scene)
  }

  function _fadeOutAll() {
    const refs = [windRef, accelRef, startRef, revRef]
    refs.forEach(ref => {
      if (ref.current) {
        gsap.to(ref.current, {
          volume: 0,
          duration: 1.0,
          overwrite: 'auto',
          onComplete: () => ref.current?.pause(),
        })
      }
    })
  }

  function _fireRevAccent(vol) {
    if (!revRef.current) return
    revRef.current.currentTime = 0
    revRef.current.volume = vol
    revRef.current.play().catch(() => {})
  }

  function _applyChapterVolumes(scene) {
    const map = {
      0: { wind: 0.00, accel: 0.02 }, // ARRIVAL: very subtle presence
      1: { wind: 0.15, accel: 0.02 }, // DESIGN: wind + subtle presence
      2: { wind: 0.25, accel: 0.50 }, // PERFORMANCE: strongest
      3: { wind: 0.05, accel: 0.05 }, // DRIVER'S SPACE: intimate
      4: { wind: 0.02, accel: 0.00 }, // DETAILS: extremely restrained
      5: { wind: 0.00, accel: 0.15 }, // REVEAL: subtle return
    }
    const target = map[scene] ?? { wind: 0, accel: 0 }

    if (windRef.current) {
      gsap.to(windRef.current,  { volume: target.wind,  duration: 1.5, ease: 'power2.inOut', overwrite: 'auto' })
    }
    if (accelRef.current) {
      gsap.to(accelRef.current, { volume: target.accel, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto' })
    }
  }

  return (
    <>
      <audio ref={startRef} src="/audio/car%20engine%20start.mp3"        preload="auto" />
      <audio ref={windRef}  src="/audio/Car%20Driving%20Wind.mp3"        preload="auto" loop />
      <audio ref={accelRef} src="/audio/sports%20car%20acceleration.mp3" preload="auto" loop />
      <audio ref={revRef}   src="/audio/car%20engine%20rev.mp3"          preload="auto" />
    </>
  )
}
