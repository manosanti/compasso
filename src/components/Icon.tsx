import type { CSSProperties, ReactNode } from 'react'

interface IconProps {
  /** Raw SVG children — one or more <path>/<circle>/<rect> elements. */
  children: ReactNode
  size?: number
  stroke?: string
  strokeWidth?: number
  style?: CSSProperties
}

/** Generic 24x24 stroke icon wrapper matching the design's SVG conventions. */
export function Icon({ children, size = 16, stroke = 'currentColor', strokeWidth = 1.8, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: 'none', ...style }}
    >
      {children}
    </svg>
  )
}

/** Build an icon from an array of path `d` strings (used for period icons). */
export function PathIcon({ paths, size = 16 }: { paths: string[]; size?: number }) {
  return (
    <Icon size={size}>
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </Icon>
  )
}

/** Gradient "thumbnail" square with a centered glyph, used for wishlist items. */
export function WishThumb({ letter, c1, c2, size }: { letter: string; c1: string; c2: string; size: number }) {
  return (
    <div
      style={{
        width: size + 'px',
        height: size + 'px',
        flex: 'none',
        borderRadius: '14px',
        background: `linear-gradient(140deg, ${c1}, ${c2})`,
        display: 'grid',
        placeItems: 'center',
        color: 'rgba(255,255,255,0.92)',
        fontFamily: 'Georgia, serif',
        fontSize: Math.round(size * 0.5) + 'px',
        lineHeight: 1,
      }}
    >
      {letter}
    </div>
  )
}
