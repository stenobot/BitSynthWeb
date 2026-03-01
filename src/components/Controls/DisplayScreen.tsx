import { useSynthStore } from '../../store/synthStore'
import { Visualizer } from './Visualizer'
import './DisplayScreen.css'

export function DisplayScreen() {
  const displayMessage = useSynthStore((state) => state.displayMessage)

  return (
    <div className="display-screen">
      <span className="display-screen__text">
        {displayMessage}
      </span>
      <div className="display-screen__visualizer-container">
        <Visualizer />
      </div>
    </div>
  )
}
