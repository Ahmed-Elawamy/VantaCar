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
  // 00 — ARRIVAL: Front 3/4 hero angle
  { p: 0.00, pos: [5.5, 2.5, 6.5], look: [0, 1.0, 0], rotY: 0.0 },
  // 01 — DESIGN: Front/side profile, tracking body lines
  { p: 0.14, pos: [6.5, 1.4, 2.0], look: [0, 0.8, 0], rotY: 0.05 },
  // 02 — PERFORMANCE: Aggressive side/rear angle
  { p: 0.28, pos: [5.5, 1.8, -5.0], look: [0, 1.0, 0], rotY: 0.10 },
  // 03 — DRIVER'S SPACE: Cabin/interior focus (NO reverse rotation)
  { p: 0.42, pos: [1.2, 1.6, -1.5], look: [-0.2, 1.1, 0.5], rotY: 0.10 },
  // 04 — DETAILS: Close-up macro (e.g., side/rear quarter)
  { p: 0.57, pos: [-2.5, 1.0, -3.0], look: [-1.0, 0.8, -1.0], rotY: 0.05 },
  // 05 — REVEAL intro: Sweeping pull-back
  { p: 0.71, pos: [-5.0, 2.2, 1.0], look: [0, 0.9, 0], rotY: 0.02 },
  // 06 — REVEAL final: Opposite 3/4 hero angle
  { p: 0.85, pos: [-6.5, 2.8, 5.5], look: [0, 1.0, 0], rotY: 0.0 },
  // End
  { p: 1.00, pos: [-6.5, 2.8, 5.5], look: [0, 1.0, 0], rotY: 0.0 },
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
        return i
      }
    }
    return KEYFRAMES.length - 2
  }

  useFrame((_, delta) => {
    const progress = scrollProgressRef.current
    if (progress === undefined || progress === null) return

    const keyframeIndex = findKeyframePair(progress)
    const kf0 = KEYFRAMES[keyframeIndex]
    const kf1 = KEYFRAMES[keyframeIndex + 1]
    const span = kf1.p - kf0.p
    const localT = span > 0 ? (progress - kf0.p) / span : 0
    // Smoothstep for more natural easing between keyframes
    const t = localT * localT * (3 - 2 * localT)

    let scaleFactor = 1
    if (vehicleRef.current?.modelSize) {
      // Adapt camera coordinates dynamically to the actual GLB dimensions
      const maxD = Math.max(vehicleRef.current.modelSize.x, vehicleRef.current.modelSize.z)
      scaleFactor = maxD > 0 ? (maxD / 4) : 1
    }

    k0Pos.set(...kf0.pos).multiplyScalar(scaleFactor)
    k1Pos.set(...kf1.pos).multiplyScalar(scaleFactor)
    targetPos.copy(k0Pos).lerp(k1Pos, t)

    k0Look.set(...kf0.look).multiplyScalar(scaleFactor)
    k1Look.set(...kf1.look).multiplyScalar(scaleFactor)
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
