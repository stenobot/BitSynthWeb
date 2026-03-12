import { useState } from 'react'
import { useSynthStore } from '../../store/synthStore'
import { PRESETS } from '../../store/presets'
import './SavePresetDialog.css'

export function SavePresetDialog() {
  const { activePreset, showSaveDialog, setShowSaveDialog, saveCurrentAsPreset } = useSynthStore()
  const [name, setName] = useState('')

  if (!showSaveDialog) return null

  const currentName = PRESETS[activePreset]?.name ?? ''
  const presetName = name || currentName

  const handleSave = () => {
    const trimmed = presetName.trim()
    if (!trimmed) return
    saveCurrentAsPreset(trimmed)
    setName('')
  }

  const handleCancel = () => {
    setShowSaveDialog(false)
    setName('')
  }

  return (
    <div className="save-preset-overlay" onClick={handleCancel}>
      <div className="save-preset-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Save Preset</h3>
        <input
          type="text"
          placeholder={currentName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
          maxLength={34}
          autoFocus
        />
        <div className="save-preset-dialog__buttons">
          <button className="save-preset-dialog__btn-save" onClick={handleSave}>
            Save
          </button>
          <button className="save-preset-dialog__btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
