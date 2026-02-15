import { useSynthStore } from '../../store/synthStore'
import { PRESETS } from '../../store/presets'
import './PresetSelector.css'

export function PresetSelector() {
  const { activePreset, applyPreset } = useSynthStore()

  return (
    <div className="preset-selector">
      {PRESETS.map((preset, index) => (
        <button
          key={index}
          className={`preset-button ${activePreset === index ? 'preset-button--active' : ''}`}
          onClick={() => applyPreset(index)}
          title={preset.name}
        >
          {index + 1}
        </button>
      ))}
    </div>
  )
}
