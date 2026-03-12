import { useLoopStore } from '../../store/loopStore'
import './CountdownOverlay.css'

export function CountdownOverlay() {
  const countdown = useLoopStore((state) => state.countdown)

  if (countdown === null) return null

  return (
    <div className="countdown-overlay">
      <span className="countdown-overlay__number">{countdown}</span>
    </div>
  )
}
