import { useState, useEffect } from 'react'

type Orientation = 'portrait' | 'landscape'

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === 'undefined') return 'landscape'
    return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
  })

  useEffect(() => {
    const mql = window.matchMedia('(orientation: portrait)')
    const handler = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? 'portrait' : 'landscape')
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return orientation
}
