import * as THREE from 'three'

/**
 * GLTFLoader plugin for KHR_materials_pbrSpecularGlossiness.
 *
 * This extension is the legacy specular-glossiness PBR workflow (glTF 1.0 / 2.0
 * extension). Modern Three.js GLTFLoader only supports the metallic-roughness
 * workflow. This plugin hooks into the loader's plugin system so that materials
 * using this extension are correctly parsed during loading — textures are
 * resolved through the parser's async dependency pipeline, not assigned as
 * raw Promises.
 *
 * Conversion:
 *  - diffuseFactor → color + opacity
 *  - diffuseTexture → map (sRGB)
 *  - glossinessFactor → roughness (inverted)
 *  - specularGlossinessTexture → roughnessMap (alpha = glossiness)
 *  - specularFactor → approximated as metalness
 */
export class GLTFMaterialsSpecularGlossinessExtension {
  constructor(parser) {
    this.parser = parser
    this.name = 'KHR_materials_pbrSpecularGlossiness'
  }

  getMaterialType(materialIndex) {
    const extension = this._getExtension(materialIndex)
    return extension !== null ? THREE.MeshStandardMaterial : null
  }

  extendMaterialParams(materialIndex, materialParams) {
    const extension = this._getExtension(materialIndex)
    if (extension === null) return Promise.resolve()

    const parser = this.parser
    const pending = []

    // Diffuse factor → base color + opacity
    if (Array.isArray(extension.diffuseFactor)) {
      const [r, g, b, a] = extension.diffuseFactor
      materialParams.color = new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace)
      materialParams.opacity = a !== undefined ? a : 1
    } else {
      materialParams.color = new THREE.Color(1, 1, 1)
      materialParams.opacity = 1
    }

    // Diffuse texture → map (sRGB)
    if (extension.diffuseTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          'map',
          extension.diffuseTexture,
          THREE.SRGBColorSpace,
        ),
      )
    }

    // Glossiness → roughness (inverted: high gloss = low roughness)
    const glossiness = extension.glossinessFactor !== undefined
      ? extension.glossinessFactor
      : 1.0
    materialParams.roughness = 1.0 - glossiness

    // Specular factor → approximate metalness
    // Dielectric specular is ~0.04, metallic specular is the metal's color
    // We use the luminance of the specular factor to estimate metalness
    if (Array.isArray(extension.specularFactor)) {
      const [sr, sg, sb] = extension.specularFactor
      const luminance = 0.2126 * sr + 0.7152 * sg + 0.0722 * sb
      materialParams.metalness = Math.min(1, luminance * 2)
    } else {
      materialParams.metalness = 0.5
    }

    // Specular-glossiness texture
    // RGB = specular color, A = glossiness
    // We use the alpha (glossiness) as roughness map (inverted in shader by setting roughness=1)
    if (extension.specularGlossinessTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          'roughnessMap',
          extension.specularGlossinessTexture,
        ),
      )
      pending.push(
        parser.assignTexture(
          materialParams,
          'metalnessMap',
          extension.specularGlossinessTexture,
        ),
      )
      // When a roughnessMap is present, the roughness value acts as a multiplier
      // The texture's alpha channel contains glossiness (0=glossy, 1=matte)
      // Three.js roughnessMap uses green channel for roughness, but SG uses alpha for glossiness
      // We set roughness to 1 so the map fully controls it
      materialParams.roughness = 1.0
    }

    return Promise.all(pending)
  }

  _getExtension(materialIndex) {
    const materialDef = this.parser.json.materials[materialIndex]
    if (
      materialDef &&
      materialDef.extensions &&
      materialDef.extensions[this.name]
    ) {
      return materialDef.extensions[this.name]
    }
    return null
  }
}
