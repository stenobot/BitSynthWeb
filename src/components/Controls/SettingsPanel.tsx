import { useSynthStore } from '../../store/synthStore'
import { restoreDefaultPresets } from '../../store/presets'
import './SettingsPanel.css'

export function SettingsPanel() {
  const {
    experimentalKeyboardPortrait, setExperimentalKeyboardPortrait,
    experimentalKeyboardLandscape, setExperimentalKeyboardLandscape,
    pitchSnapEnabled, setPitchSnapEnabled,
    showEightBitPanel, setShowEightBitPanel,
    showSynthPanel, setShowSynthPanel,
    showEffectsPanel, setShowEffectsPanel,
    setShowSettingsPanel, applyPreset
  } = useSynthStore()

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
              Experimental keyboard (portrait)
              <span className="settings-panel__sublabel">Unique S-shaped layout for phone in portrait</span>
            </span>
            <div
              className={`settings-panel__switch ${experimentalKeyboardPortrait ? 'settings-panel__switch--on' : ''}`}
              onClick={() => setExperimentalKeyboardPortrait(!experimentalKeyboardPortrait)}
            >
              <div className="settings-panel__switch-thumb" />
            </div>
          </label>
          <label className="settings-panel__toggle">
            <span className="settings-panel__label">
              Experimental keyboard (landscape)
              <span className="settings-panel__sublabel">Unique split layout for phone in landscape</span>
            </span>
            <div
              className={`settings-panel__switch ${experimentalKeyboardLandscape ? 'settings-panel__switch--on' : ''}`}
              onClick={() => setExperimentalKeyboardLandscape(!experimentalKeyboardLandscape)}
            >
              <div className="settings-panel__switch-thumb" />
            </div>
          </label>
          <label className="settings-panel__toggle">
            <span className="settings-panel__label">
              Pitch lock
              <span className="settings-panel__sublabel">Snap pitch back to normal on release</span>
            </span>
            <div
              className={`settings-panel__switch ${pitchSnapEnabled ? 'settings-panel__switch--on' : ''}`}
              onClick={() => setPitchSnapEnabled(!pitchSnapEnabled)}
            >
              <div className="settings-panel__switch-thumb" />
            </div>
          </label>
          <label className="settings-panel__toggle">
            <span className="settings-panel__label">
              Show 8-bit panel
            </span>
            <div
              className={`settings-panel__switch ${showEightBitPanel ? 'settings-panel__switch--on' : ''}`}
              onClick={() => setShowEightBitPanel(!showEightBitPanel)}
            >
              <div className="settings-panel__switch-thumb" />
            </div>
          </label>
          <label className="settings-panel__toggle">
            <span className="settings-panel__label">
              Show synth panel
            </span>
            <div
              className={`settings-panel__switch ${showSynthPanel ? 'settings-panel__switch--on' : ''}`}
              onClick={() => setShowSynthPanel(!showSynthPanel)}
            >
              <div className="settings-panel__switch-thumb" />
            </div>
          </label>
          <label className="settings-panel__toggle">
            <span className="settings-panel__label">
              Show effects panel
            </span>
            <div
              className={`settings-panel__switch ${showEffectsPanel ? 'settings-panel__switch--on' : ''}`}
              onClick={() => setShowEffectsPanel(!showEffectsPanel)}
            >
              <div className="settings-panel__switch-thumb" />
            </div>
          </label>
          <button
            className="settings-panel__restore-btn"
            onClick={() => { restoreDefaultPresets(); applyPreset(0); setShowSettingsPanel(false) }}
          >
            Restore default presets
          </button>
        </div>
      </div>
    </div>
  )
}
