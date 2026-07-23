import type { Checks, Meta, Period, RoutineItem, StockItem, User, WishCategory, WishItem } from '../types'

// ---------------------------------------------------------------------------
// Period metadata + icons
// ---------------------------------------------------------------------------

export const PERIOD_META: Record<Period, { label: string }> = {
  manha: { label: 'Manhã' },
  tarde: { label: 'Tarde' },
  noite: { label: 'Noite' },
}

export const PERIOD_ORDER: Period[] = ['manha', 'tarde', 'noite']

/** SVG path `d` strings composing each period's icon (sun / sunset / moon). */
export const PERIOD_ICON: Record<Period, string[]> = {
  manha: [
    'M12 3v1',
    'M12 20v1',
    'M3 12H2',
    'M22 12h-1',
    'M5.6 5.6l.7.7',
    'M17.7 17.7l.7.7',
    'M18.4 5.6l-.7.7',
    'M6.3 17.7l-.7.7',
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  ],
  tarde: [
    'M12 2v2',
    'M4.9 4.9l1.4 1.4',
    'M2 12h2',
    'M20 12h2',
    'M19.1 4.9l-1.4 1.4',
    'M8 16a4 4 0 1 1 8 0',
    'M3 20h18',
  ],
  noite: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
}

// ---------------------------------------------------------------------------
// Wishlist link "reading" — a fake product detector for the prototype.
// ---------------------------------------------------------------------------

interface CatalogEntry {
  key: string[]
  name: string
  price: number
  c1: string
  c2: string
  l: string
}

const CATALOG: CatalogEntry[] = [
  { key: ['amazon', 'sony', 'fone', 'headphone'], name: 'Fone Sony WH-1000XM5', price: 2099, c1: '#334155', c2: '#0f172a', l: '♪' },
  { key: ['mercado', 'mercadoli', 'cadeira', 'gamer'], name: 'Cadeira Gamer ThunderX3', price: 1149, c1: '#7c2d12', c2: '#431407', l: '▤' },
  { key: ['shopee', 'luminaria', 'led', 'abajur'], name: 'Luminária LED de Mesa', price: 79.9, c1: '#b45309', c2: '#78350f', l: '☀' },
  { key: ['nike', 'tenis', 'tênis', 'adidas'], name: 'Tênis Nike Air Zoom', price: 649, c1: '#0f766e', c2: '#134e4a', l: '✦' },
  { key: ['apple', 'watch', 'iphone', 'mac'], name: 'Apple Watch SE', price: 2499, c1: '#334155', c2: '#1e293b', l: '⌚' },
]

export interface DetectResult {
  name: string
  price: number
  c1: string
  c2: string
  l: string
}

/** Detect a product from a pasted URL, falling back to a generated item. */
export function detect(url: string): DetectResult {
  const u = (url || '').toLowerCase()
  for (const c of CATALOG) {
    if (c.key.some((k) => u.includes(k))) return { name: c.name, price: c.price, c1: c.c1, c2: c.c2, l: c.l }
  }
  let host = 'produto'
  try {
    host = new URL(url).hostname.replace('www.', '')
  } catch {
    /* ignore */
  }
  const base = host.split('.')[0] || 'Produto'
  const name = base.charAt(0).toUpperCase() + base.slice(1) + ' — item salvo'
  return {
    name,
    price: Math.round(80 + Math.random() * 900),
    c1: '#475569',
    c2: '#1e293b',
    l: base.charAt(0).toUpperCase(),
  }
}

/** Generate a plausible descending price history ending at `current`. */
export function genHistory(current: number): number[] {
  const arr: number[] = []
  let v = current * (1.05 + Math.random() * 0.15)
  for (let i = 0; i < 7; i++) {
    arr.push(Math.round(v))
    v = v * (0.97 + Math.random() * 0.05)
  }
  arr.push(Math.round(current))
  return arr
}

/** Convert a price series to `<polyline>` points over a 220x46 viewBox. */
export function polyPoints(vals: number[]): string {
  const w = 220
  const h = 46
  const pad = 4
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  return vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * w
      const y = h - pad - ((v - min) / range) * (h - 2 * pad)
      return x.toFixed(1) + ',' + y.toFixed(1)
    })
    .join(' ')
}

// ---------------------------------------------------------------------------
// Seed / default data
// ---------------------------------------------------------------------------

export const DEFAULT_ROUTINE: RoutineItem[] = [
  { id: 'r01', name: 'Escovar os dentes', period: 'manha', time: '07:00' },
  { id: 'r02', name: 'Lavar o rosto + protetor solar', period: 'manha', time: '07:10' },
  { id: 'r03', name: 'Rotina de skincare', period: 'manha' },
  { id: 'r04', name: 'Café da manhã', period: 'manha', time: '07:40' },
  { id: 'r05', name: 'Cápsula capilar', period: 'manha', stock: 'Cápsula capilar', qty: '1 cápsula' },
  { id: 'r06', name: 'Almoço', period: 'tarde', time: '12:30' },
  { id: 'r07', name: 'Beber 2L de água', period: 'tarde' },
  { id: 'r08', name: 'Remédio de pressão', period: 'tarde', time: '14:00', stock: 'Remédio pressão', qty: '1 comp.' },
  { id: 'r09', name: 'Jantar', period: 'noite', time: '19:30' },
  { id: 'r10', name: 'Skincare noturno', period: 'noite' },
  { id: 'r11', name: 'Spray capilar', period: 'noite', time: '22:00', stock: 'Spray capilar', qty: '1 ml' },
]

export const DEFAULT_STOCK: StockItem[] = [
  { id: 's1', name: 'Cápsula capilar', unit: 'cápsulas', qty: 50, total: 90, perDay: 1, price: 90 },
  { id: 's2', name: 'Spray capilar', unit: 'ml', qty: 4, total: 65, perDay: 1, price: 230 },
  { id: 's3', name: 'Vitamina D', unit: 'comp.', qty: 58, total: 60, perDay: 1, price: 45 },
  { id: 's4', name: 'Remédio pressão', unit: 'comp.', qty: 22, total: 100, perDay: 1, price: 38 },
]

/** Palette cycled through when the user creates a new category. */
export const CAT_COLORS = ['#2f8f83', '#3a5a8c', '#9e3b4e', '#b68235', '#4a7a3f', '#7c5cb0', '#c2683a']

export const DEFAULT_CATS: WishCategory[] = [
  { id: 'c1', name: 'Eletrônicos', color: '#3a5a8c' },
  { id: 'c2', name: 'Casa', color: '#4a7a3f' },
  { id: 'c3', name: 'Estudo', color: '#b68235' },
]

export const DEFAULT_WISH: WishItem[] = [
  {
    id: 'w1',
    name: 'Fone Sony WH-1000XM5',
    host: 'amazon.com.br',
    letter: '♪',
    c1: '#334155',
    c2: '#0f172a',
    saved: 2299,
    hist: [2499, 2499, 2399, 2450, 2299, 2350, 2199, 2099],
    target: 1999,
    cat: 'c1',
  },
  {
    id: 'w2',
    name: 'Cadeira Gamer ThunderX3',
    host: 'mercadolivre.com.br',
    letter: '▤',
    c1: '#7c2d12',
    c2: '#431407',
    saved: 1089,
    hist: [999, 1049, 1020, 1089, 1120, 1100, 1149, 1149],
    target: 999,
    cat: 'c2',
  },
]

export const DEFAULT_META: Meta = {
  min: 80,
  reward: 'Comprar a capinha nova',
  punish: 'Sem delivery a semana toda',
}

export const DEFAULT_USER: User = {
  name: 'Lucas Santiago',
  email: 'lucas.santiago@email.com',
}

/** Seed a month of plausible completion history up to (and including) today. */
export function seedChecks(ids: string[]): Checks {
  const out: Checks = {}
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const y = today.getFullYear()
  const m = today.getMonth()
  for (let day = 1; day <= today.getDate(); day++) {
    const dd = new Date(y, m, day)
    const isToday = day === today.getDate()
    let ratio = isToday ? 0.55 : 0.6 + Math.random() * 0.4
    if (!isToday && Math.random() < 0.15) ratio = Math.random() * 0.35
    const n = Math.round(ids.length * ratio)
    out[dd.toISOString().slice(0, 10)] = ids.slice(0, n)
  }
  return out
}
