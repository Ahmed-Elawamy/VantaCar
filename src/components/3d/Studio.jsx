import { useRef, useMemo } from 'react'
import { Environment, ContactShadows } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Environment keyframes keyed to scroll progress.
 * Light intensities and rim color evolve per chapter.
 */
const ENV_KEYFRAMES = [
  // 00 ARRIVAL — balanced graphite studio
  { p: 0.00, key: 1.8, fill: 0.5, rim: 0.5, rimR: 0x9b7fc8, hemi: 0.35 },
  // 01 DESIGN — clean, bright, metallic
  { p: 0.14, key: 2.2, fill: 0.6, rim: 0.5, rimR: 0xc8d0f0, hemi: 0.45 },
  // 02 PERFORMANCE — deeper, stronger contrast
  { p: 0.28, key: 2.5, fill: 0.4, rim: 0.7, rimR: 0x8b5cf6, hemi: 0.25 },
  // 03 DRIVER'S SPACE — intimate, warm
  { p: 0.42, key: 1.6, fill: 0.45, rim: 0.55, rimR: 0xa78bfa, hemi: 0.30 },
  // 04 DETAILS — luxury dark, focused
  { p: 0.57, key: 1.5, fill: 0.35, rim: 0.45, rimR: 0x9b7fc8, hemi: 0.20 },
  // 05 REVEAL intro — brightening
  { p: 0.71, key: 2.0, fill: 0.5, rim: 0.6, rimR: 0xa78bfa, hemi: 0.35 },
  // 06 REVEAL final — refined cinematic
  { p: 0.85, key: 2.0, fill: 0.5, rim: 0.6, rimR: 0xa78bfa, hemi: 0.35 },
  { p: 1.00, key: 2.0, fill: 0.5, rim: 0.6, rimR: 0xa78bfa, hemi: 0.35 },
]

function findPair(progress) {
  for (let i = 0; i < ENV_KEYFRAMES.length - 1; i++) {
    if (progress >= ENV_KEYFRAMES[i].p && progress <= ENV_KEYFRAMES[i + 1].p) {
      return [ENV_KEYFRAMES[i], ENV_KEYFRAMES[i + 1]]
    }
  }
  return [ENV_KEYFRAMES[ENV_KEYFRAMES.length - 2], ENV_KEYFRAMES[ENV_KEYFRAMES.length - 1]]
}

export default function Studio({ scrollProgressRef }) {
  const keyLightRef = useRef()
  const fillLightRef = useRef()
  const rimLightRef = useRef()
  const hemiLightRef = useRef()

  const tmpColor = useMemo(() => new THREE.Color(), [])
  const curColor = useMemo(() => new THREE.Color(), [])
  const nxtColor = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const progress = scrollProgressRef.current
    if (progress === undefined || progress === null) return

    const [kf0, kf1] = findPair(progress)
    const span = kf1.p - kf0.p
    const localT = span > 0 ? (progress - kf0.p) / span : 0
    const t = localT * localT * (3 - 2 * localT)

    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(kf0.key, kf1.key, t)
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.lerp(kf0.fill, kf1.fill, t)
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(kf0.rim, kf1.rim, t)
      curColor.setHex(kf0.rimR)
      nxtColor.setHex(kf1.rimR)
      tmpColor.copy(curColor).lerp(nxtColor, t)
      rimLightRef.current.color.copy(tmpColor)
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = THREE.MathUtils.lerp(kf0.hemi, kf1.hemi, t)
    }
  })

  return (
    <>
      <hemisphereLight ref={hemiLightRef} args={['#e8e6e1', '#1a1a1f', 0.35]} />
      <ambientLight intensity={0.12} color="#aaa0b5" />

      <directionalLight
        ref={keyLightRef}
        position={[7, 9, 5]}
        intensity={1.8}
        color="#fff0e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-12, 12, 12, -12, 0.1, 40]}
        />
      </directionalLight>

      <directionalLight
        ref={fillLightRef}
        position={[-6, 5, -3]}
        intensity={0.5}
        color="#c8d0f0"
      />

      <directionalLight
        ref={rimLightRef}
        position={[0, 5, -8]}
        intensity={0.5}
        color="#9b7fc8"
      />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={16}
        blur={3}
        far={10}
        resolution={1024}
        color="#000000"
      />

      <Environment preset="studio" background={false} />
    </>
  )
}
