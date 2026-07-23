import type { CSSProperties } from 'react'

/**
 * Style builders ported from the design. These return `CSSProperties` objects
 * rather than inline style strings, but produce the same visual output.
 */

/** Pill tab inside the Hoje/Semana/Estoque segmented control. */
export function tabBtnStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    padding: '11px',
    border: 0,
    borderRadius: 'calc(var(--radius-lg) - 4px)',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '14px',
    ...(active
      ? { background: 'var(--color-surface)', color: 'var(--color-accent)', boxShadow: 'var(--shadow-sm)' }
      : { background: 'transparent', color: 'color-mix(in srgb, var(--color-text) 52%, transparent)' }),
  }
}

/** Top-level Rotina / Wishlist underline nav item. */
export function navStyle(active: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '13px 2px',
    marginBottom: '-1px',
    background: 'transparent',
    border: 0,
    borderBottom: `2px solid ${active ? 'var(--color-accent)' : 'transparent'}`,
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '15px',
    color: active ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 48%, transparent)',
  }
}

/** Rounded category filter / selector chip. `color` tints the active state. */
export function chipStyle(active: boolean, color?: string | null): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '7px 14px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    border: `1px solid ${active ? color || 'var(--color-accent)' : 'var(--color-divider)'}`,
    background: active
      ? color
        ? `color-mix(in srgb, ${color} 30%, var(--color-surface))`
        : 'var(--color-accent-weak)'
      : 'var(--color-surface)',
    color: active ? color || 'var(--color-accent-strong)' : 'color-mix(in srgb, var(--color-text) 60%, transparent)',
  }
}

/** Small colored dot used inside category chips and badges. */
export function dotStyle(color: string): CSSProperties {
  return { width: '9px', height: '9px', borderRadius: '50%', background: color, flex: 'none' }
}

/** Category badge shown on a saved wishlist card. */
export function catBadgeStyle(color: string): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '999px',
    background: `color-mix(in srgb, ${color} 13%, transparent)`,
    color,
  }
}

/** Theme light/dark segmented button in Settings. */
export function segStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '14px',
    ...(active
      ? { border: '1.5px solid var(--color-accent)', color: 'var(--color-accent)', background: 'var(--color-accent-weak)' }
      : {
          border: '1px solid var(--color-divider)',
          color: 'color-mix(in srgb, var(--color-text) 58%, transparent)',
          background: 'transparent',
        }),
  }
}
