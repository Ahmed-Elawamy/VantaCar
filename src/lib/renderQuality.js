function isMobileDevice() {
  if (typeof window === 'undefined') return false
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches
  const userAgent = navigator.userAgent || ''
  return coarsePointer || /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
}

export function getRenderQuality() {
  if (typeof window === 'undefined') {
    return { tier: 'high', dpr: 2, shadowMapSize: 2048, contactShadows: true, contactResolution: 1024 }
  }

  const mobile = isMobileDevice()
  const cores = navigator.hardwareConcurrency || 4
  const dpr = window.devicePixelRatio || 1

  if (mobile && cores <= 4) {
    return { tier: 'low', dpr: Math.min(1.1, dpr), shadowMapSize: 512, contactShadows: false, contactResolution: 256 }
  }

  if (mobile || cores <= 6) {
    return { tier: 'medium', dpr: Math.min(1.25, dpr), shadowMapSize: 1024, contactShadows: true, contactResolution: 512 }
  }

  if (dpr >= 2 && cores >= 8) {
    return { tier: 'high', dpr: Math.min(2, dpr), shadowMapSize: 2048, contactShadows: true, contactResolution: 1024 }
  }

  return { tier: 'medium', dpr: Math.min(1.5, dpr), shadowMapSize: 1024, contactShadows: true, contactResolution: 512 }
}
