import { useSynthStore } from '../../store/synthStore'
import './SettingsPanel.css'

export function SettingsPanel() {
  const { experimentalKeyboard, setExperimentalKeyboard, setShowSettingsPanel } = useSynthStore()

  return (
    <div className="settings-overlay" onClick={() => setShowSettingsPanel(false)}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel__header">
          <h2>Settings</h2>
          <button
            className="settings-panel__close"
            onClick={() => setShowSettingsPanel(false)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <div className="settings-panel__body">
          <label className="settings-panel__toggle">
            <span className="settings-panel__label">
              Experimental keyboard
              <span className="settings-panel__sublabel">(portrait orientation only)</span>
            </span>
            <div
              className={`settings-panel__switch ${experimentalKeyboard ? 'settings-panel__switch--on' : ''}`}
              onClick={() => setExperimentalKeyboard(!experimentalKeyboard)}
            >
              <div className="settings-panel__switch-thumb" />
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
