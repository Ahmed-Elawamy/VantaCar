import { useRef, useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Camera keyframes keyed to scroll progress (0-1).
 * Each keyframe defines camera position, lookAt, and vehicle Y-rotation.
 * The vehicle is ONE intact object — only whole-object rotation is applied.
 *
 * Chapter layout (7 sections, each 1/7 of scroll):
 * 0.00 - 0.14  ARRIVAL       — 3/4 front wide
 * 0.14 - 0.28  DESIGN        — closer exterior, front fascia
 * 0.28 - 0.42  PERFORMANCE   — dynamic wider rear-3/4
 * 0.42 - 0.57  DRIVER        — interior-focused, closer, high angle
 * 0.57 - 0.71  DETAILS      — close-up detail shots
 * 0.71 - 0.85  REVEAL intro  — pulling back
 * 0.85 - 1.00  REVEAL final  — wide 3/4 cinematic
 */
const KEYFRAMES = [
  // 00 — ARRIVAL: 3/4 front wide shot
  { p: 0.00, pos: [5.5, 2.8, 6.5], look: [0, 1.0, 0], rotY: 0.55 },
  // 01 — DESIGN: closer, front fascia focus
  { p: 0.14, pos: [2.5, 1.4, 4.2], look: [0, 0.7, 0], rotY: 0.30 },
  // 02 — PERFORMANCE: dynamic rear-3/4, pulled back
  { p: 0.28, pos: [6.5, 1.8, -5.0], look: [0, 0.9, 0], rotY: -0.45 },
  // 03 — DRIVER'S SPACE: interior-focused, closer, slightly elevated
  { p: 0.42, pos: [1.0, 1.6, 2.8], look: [-0.3, 1.1, 0], rotY: 0.10 },
  // 04 — DETAILS: close-up, low angle
  { p: 0.57, pos: [1.5, 0.6, 2.0], look: [0.4, 0.5, 0], rotY: 0.20 },
  // 05 — REVEAL intro: pulling back
  { p: 0.71, pos: [4.0, 2.2, 5.0], look: [0, 0.9, 0], rotY: 0.40 },
  // 06 — REVEAL final: wide cinematic 3/4
  { p: 0.85, pos: [6.0, 3.0, 7.0], look: [0, 1.0, 0], rotY: 0.45 },
  // End
  { p: 1.00, pos: [6.0, 3.0, 7.0], look: [0, 1.0, 0], rotY: 0.45 },
]

export default function CameraRig({ scrollProgressRef, vehicleRef, controlsRef }) {
  const { camera } = useThree()
  const isScrolling = useRef(false)
  const scrollTimeout = useRef(null)

  const targetPos = useMemo(() => new THREE.Vector3(), [])
  const targetLook = useMemo(() => new THREE.Vector3(), [])
  const k0Pos = useMemo(() => new THREE.Vector3(), [])
  const k1Pos = useMemo(() => new THREE.Vector3(), [])
  const k0Look = useMemo(() => new THREE.Vector3(), [])
  const k1Look = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    camera.position.set(...KEYFRAMES[0].pos)
    camera.lookAt(...KEYFRAMES[0].look)
  }, [camera])

  useEffect(() => {
    const checkScroll = () => {
      isScrolling.current = true
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 400)
    }
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  function findKeyframePair(progress) {
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (progress >= KEYFRAMES[i].p && progress <= KEYFRAMES[i + 1].p) {
        return [KEYFRAMES[i], KEYFRAMES[i + 1]]
      }
    }
    return [KEYFRAMES[KEYFRAMES.length - 2], KEYFRAMES[KEYFRAMES.length - 1]]
  }

  useFrame((_, delta) => {
    const progress = scrollProgressRef.current
    if (progress === undefined || progress === null) return

    const [kf0, kf1] = findKeyframePair(progress)
    const span = kf1.p - kf0.p
    const localT = span > 0 ? (progress - kf0.p) / span : 0
    // Smoothstep for more natural easing between keyframes
    const t = localT * localT * (3 - 2 * localT)

    k0Pos.set(...kf0.pos)
    k1Pos.set(...kf1.pos)
    targetPos.copy(k0Pos).lerp(k1Pos, t)

    k0Look.set(...kf0.look)
    k1Look.set(...kf1.look)
    targetLook.copy(k0Look).lerp(k1Look, t)

    const targetRotY = THREE.MathUtils.lerp(kf0.rotY, kf1.rotY, t)

    const lerpFactor = 1 - Math.pow(0.001, delta)

    if (isScrolling.current) {
      camera.position.lerp(targetPos, lerpFactor)
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, lerpFactor)
        controlsRef.current.update()
      } else {
        camera.lookAt(targetLook)
      }
      if (vehicleRef.current?.group) {
        vehicleRef.current.group.rotation.y = targetRotY
      }
    } else {
      if (vehicleRef.current?.group) {
        const currentRotY = vehicleRef.current.group.rotation.y
        vehicleRef.current.group.rotation.y = THREE.MathUtils.lerp(
          currentRotY,
          targetRotY,
          lerpFactor * 0.3,
        )
      }
    }
  })

  return null
}
