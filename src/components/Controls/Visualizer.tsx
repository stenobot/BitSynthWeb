import { useRef, useEffect, useCallback } from 'react'
import { getAudioEngine } from '../../App'
import { useSynthStore } from '../../store/synthStore'
import './Visualizer.css'

export function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const hasKeysPressed = useSynthStore((state) => state.pressedKeys.size > 0)

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * devicePixelRatio
    canvas.height = rect.height * devicePixelRatio
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    resizeCanvas()

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const engine = getAudioEngine()
      const analyser = engine?.getAnalyser()

      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)

      if (!analyser) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      ctx.lineWidth = 1.5 * devicePixelRatio
      ctx.strokeStyle = '#80b027'
      ctx.shadowColor = 'rgba(51, 255, 51, 0.5)'
      ctx.shadowBlur = 4 * devicePixelRatio
      ctx.beginPath()

      const sliceWidth = width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(width, height / 2)
      ctx.stroke()
      ctx.shadowBlur = 0

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
      observer.disconnect()
    }
  }, [resizeCanvas])

  return (
    <div className={`visualizer ${hasKeysPressed ? 'visualizer--active' : ''}`}>
      <canvas ref={canvasRef} className="visualizer__canvas" />
    </div>
  )
}
