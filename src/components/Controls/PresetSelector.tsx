import { useSynthStore } from '../../store/synthStore'
import { PRESETS } from '../../store/presets'
import './PresetSelector.css'

export function PresetSelector() {
  const { activePreset, presetModified, applyPreset, setShowSaveDialog } = useSynthStore()

  return (
    <div className="preset-selector">
      {PRESETS.map((_preset, index) => {
        const isActive = activePreset === index
        const isModified = isActive && presetModified

        return (
          <button
            key={index}
            className={`preset-button ${isActive ? (isModified ? 'preset-button--modified' : 'preset-button--active') : ''}`}
            onClick={() => isModified ? setShowSaveDialog(true) : applyPreset(index)}
            title={PRESETS[index].name}
          >
            {isModified ? (
              <img src="/images/save.svg" alt="Save" className="preset-button__save-icon" />
            ) : (
              index + 1
            )}
          </button>
        )
      })}
    </div>
  )
}
