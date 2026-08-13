import { useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFMaterialsSpecularGlossinessExtension } from '../../lib/materialCompat'

const MODEL_PATH = '/models/audi_r8_spyder-optimized.glb'

function extendLoader(loader) {
  loader.register((parser) => {
    return new GLTFMaterialsSpecularGlossinessExtension(parser)
  })
}

const Vehicle = forwardRef(function Vehicle({ onLoaded }, ref) {
  const groupRef = useRef()

  const gltf = useGLTF(MODEL_PATH, true, true, extendLoader)

  const { centerOffset, scale, modelSize } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 4
    const s = maxDim > 0 ? targetSize / maxDim : 1
    return {
      centerOffset: [-center.x, -box.min.y, -center.z],
      scale: s,
      modelSize: size.clone().multiplyScalar(s),
    }
  }, [gltf])

  useImperativeHandle(ref, () => ({
    group: groupRef.current,
    modelSize,
    scale,
  }), [modelSize, scale])

  useEffect(() => {
    let meshCount = 0
    let materialCount = 0
    let textureCount = 0
    const materialSet = new Set()
    const textureSet = new Set()

    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        meshCount++
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        for (const mat of mats) {
          if (mat && !materialSet.has(mat.uuid)) {
            materialSet.add(mat.uuid)
            materialCount++
            for (const key of Object.keys(mat)) {
              const val = mat[key]
              if (val instanceof THREE.Texture && !textureSet.has(val.uuid)) {
                textureSet.add(val.uuid)
                textureCount++
              }
            }
          }
        }
      }
    })

    onLoaded?.({
      meshCount,
      materialCount,
      textureCount,
      modelSize,
      scale,
    })
  }, [gltf, modelSize, scale, onLoaded])

  return (
    <group ref={groupRef} position={centerOffset} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  )
})

export default Vehicle

useGLTF.preload(MODEL_PATH, true, true, extendLoader)
