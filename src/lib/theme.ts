import type { CSSProperties } from 'react'
import type { AccentKey, Theme } from '../types'

export interface Accent {
  name: string
  base: string
  strong: string
}

export const ACCENTS: Record<AccentKey, Accent> = {
  teal: { name: 'Teal', base: '#0d9488', strong: '#0f766e' },
  indigo: { name: 'Índigo', base: '#4f46e5', strong: '#4338ca' },
  rose: { name: 'Rosa', base: '#e11d48', strong: '#be123c' },
  amber: { name: 'Âmbar', base: '#d97706', strong: '#b45309' },
  emerald: { name: 'Esmeralda', base: '#059669', strong: '#047857' },
}

export const ACCENT_KEYS = Object.keys(ACCENTS) as AccentKey[]

/**
 * Build the CSS-variable style object applied to the app root, driven by the
 * chosen accent color and light/dark theme.
 */
export function themeVars(accentKey: AccentKey, theme: Theme): CSSProperties {
  const a = ACCENTS[accentKey] ?? ACCENTS.teal
  const dark = theme === 'dark'
  const surface = dark ? '#1e293b' : '#ffffff'
  return {
    '--color-accent': a.base,
    '--color-accent-2': a.base,
    '--color-accent-strong': a.strong,
    '--color-accent-weak': dark
      ? `color-mix(in srgb, ${a.base} 26%, ${surface})`
      : `color-mix(in srgb, ${a.base} 13%, #ffffff)`,
    '--color-bg': dark ? '#0f172a' : '#eef2f2',
    '--color-surface': surface,
    '--color-text': dark ? '#e2e8f0' : '#1f2a37',
    '--color-divider': dark ? 'rgba(226,232,240,.12)' : '#e4e9ea',
    minHeight: '100vh',
    fontFamily: 'var(--font-body)',
    background: dark ? '#0f172a' : '#eef2f2',
    color: dark ? '#e2e8f0' : '#1f2a37',
  } as CSSProperties
}
