import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

import { LangProvider } from './lib/LangContext'
import Vehicle from './components/3d/Vehicle'
import Studio from './components/3d/Studio'
import CameraRig from './components/3d/CameraRig'
import Navigation from './components/layout/Navigation'
import ProgressIndicator from './components/layout/ProgressIndicator'
import Footer from './components/layout/Footer'
import LoadingScreen from './components/ui/LoadingScreen'
import AudioController from './components/audio/AudioController'

import SceneArrival from './sections/SceneArrival'
import SceneDesign from './sections/SceneDesign'
import ScenePerformance from './sections/ScenePerformance'
import SceneDriverSpace from './sections/SceneDriverSpace'
import SceneDetail from './sections/SceneDetail'
import SceneReveal from './sections/SceneReveal'

function AppContent() {
  const [stats, setStats] = useState(null)
  const [activeScene, setActiveScene] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isSoundOn, setIsSoundOn] = useState(true)

  const controlsRef = useRef()
  const vehicleRef = useRef()
  const scrollProgressRef = useRef(0)
  const containerRef = useRef(null)

  const handleLoaded = useCallback((s) => {
    setStats(s)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main scroll progress — drives the entire 3D experience
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
          setScrollProgress(self.progress)
        },
      })

      // Active scene detection
      const sections = containerRef.current?.querySelectorAll('.scene-section')
      if (sections) {
        sections.forEach((section, i) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => {
              if (self.isActive) setActiveScene(i)
            },
          })
        })
      }

      // Typography reveal animations per scene
      sections?.forEach((section) => {
        const heading = section.querySelector('h1, h2')
        const subTexts = section.querySelectorAll('p')
        const buttons = section.querySelectorAll('button')
        const momentItems = section.querySelectorAll('h3')

        if (heading) {
          gsap.fromTo(heading, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 70%', end: 'top 30%', scrub: 1 },
          })
        }

        subTexts.forEach((p) => {
          gsap.fromTo(p, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 65%', end: 'top 35%', scrub: 1 },
          })
        })

        momentItems.forEach((h3) => {
          gsap.fromTo(h3, { opacity: 0, x: -20 }, {
            opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 60%', end: 'top 25%', scrub: 1 },
          })
        })

        buttons.forEach((btn) => {
          gsap.fromTo(btn, { opacity: 0, y: 15 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 60%', end: 'top 30%', scrub: 1 },
          })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (stats) ScrollTrigger.refresh()
  }, [stats])

  const handleNavClick = useCallback((sceneIndex) => {
    const sections = containerRef.current?.querySelectorAll('.scene-section')
    const target = sections?.[sceneIndex]
    if (target) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: target, offsetY: 0 },
        ease: 'power2.inOut',
      })
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full bg-graphite-950">
      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [5.5, 2.8, 6.5], fov: 35, near: 0.1, far: 500 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <color attach="background" args={['#15171a']} />
          <fog attach="fog" args={['#15171a', 14, 38]} />

          <Suspense fallback={null}>
            <Vehicle ref={vehicleRef} onLoaded={handleLoaded} />
            <Studio scrollProgressRef={scrollProgressRef} />
            <CameraRig
              scrollProgressRef={scrollProgressRef}
              vehicleRef={vehicleRef}
              controlsRef={controlsRef}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.05}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.5}
            makeDefault
          />
        </Canvas>
      </div>

      {/* Atmospheric gradient overlays */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-graphite-950/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-graphite-950/60 to-transparent" />
      </div>

      {/* Navigation */}
      <Navigation 
        activeScene={activeScene} 
        onNavClick={handleNavClick}
        isSoundOn={isSoundOn}
        setIsSoundOn={setIsSoundOn}
      />

      {/* Progress indicator */}
      <ProgressIndicator activeScene={activeScene} scrollProgress={scrollProgress} />

      {/* Scrollable content sections */}
      <div className="relative z-20">
        <SceneArrival />
        <SceneDesign />
        <ScenePerformance />
        <SceneDriverSpace />
        <SceneDetail />
        <SceneReveal />
        <Footer onNavClick={handleNavClick} />
      </div>

      {/* Loading screen */}
      {!stats && (
        <div className="fixed inset-0 z-[100]">
          <LoadingScreen />
        </div>
      )}

      {/* Audio System — only attached after experience is fully ready */}
      <AudioController
        isReady={!!stats}
        scrollProgress={scrollProgress}
        activeScene={activeScene}
        isSoundOn={isSoundOn}
      />
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  )
}
