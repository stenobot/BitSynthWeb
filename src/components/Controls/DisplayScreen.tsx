import { useSynthStore } from '../../store/synthStore'
import './DisplayScreen.css'

export function DisplayScreen() {
  const displayMessage = useSynthStore((state) => state.displayMessage)

  return (
    <div className="display-screen">
      <span className="display-screen__text" key={displayMessage}>
        {displayMessage}
      </span>
    </div>
  )
}
