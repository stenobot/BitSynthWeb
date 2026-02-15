import { forwardRef } from 'react'
import './Key.css'

interface KeyProps {
  isBlack: boolean
  isPressed: boolean
  style?: React.CSSProperties
}

export const Key = forwardRef<HTMLDivElement, KeyProps>(function Key(
  { isBlack, isPressed, style },
  ref
) {
  const className = [
    'key',
    isBlack ? 'key--black' : 'key--white',
    isPressed ? 'key--pressed' : ''
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={className}
      style={style}
    />
  )
})
