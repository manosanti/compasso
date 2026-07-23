export type Period = 'manha' | 'tarde' | 'noite'

export interface RoutineItem {
  id: string
  name: string
  period: Period
  /** Optional scheduled time, e.g. "07:00". */
  time?: string
  /** Optional quantity label, e.g. "1 comp.". */
  qty?: string
  /** Optional name of the stock item this consumes. */
  stock?: string
}

export interface StockItem {
  id: string
  name: string
  unit: string
  qty: number
  total: number
  perDay: number
  price: number
}

export interface WishItem {
  id: string
  name: string
  host: string
  letter: string
  c1: string
  c2: string
  saved: number
  hist: number[]
  target: number
  /** Optional wishlist category id (see WishCategory). */
  cat?: string | null
}

export interface WishCategory {
  id: string
  name: string
  /** Dot / badge color. */
  color: string
}

export interface Meta {
  min: number
  reward: string
  punish: string
}

export interface User {
  name: string
  email: string
}

/** Map of ISO date (YYYY-MM-DD) -> array of checked routine item ids. */
export type Checks = Record<string, string[]>

export type Screen = 'login' | 'app'
export type AuthMode = 'login' | 'signup'
export type Section = 'rotina' | 'wishlist'
export type Tab = 'hoje' | 'semana' | 'estoque'
export type Theme = 'light' | 'dark'
export type AccentKey = 'teal' | 'indigo' | 'rose' | 'amber' | 'emerald'
export type NotifPerm = 'default' | 'granted' | 'denied'

export interface AuthForm {
  name: string
  email: string
  pass: string
}

export interface WishPreview {
  name: string
  price: number
  letter: string
  c1: string
  c2: string
  host: string
  /** Category id selected for this pending item, if any. */
  cat: string | null
}

/** State of the "Nova categoria" dialog. */
export interface CatDialogState {
  name: string
}

export type DialogKind = 'routine' | 'stock'

export interface DialogState {
  kind: DialogKind
  period?: Period
  title: string
  l1: string
  p1: string
  v1: string
  l2: string
  p2: string
  v2: string
  l3: string
  p3: string
  v3: string
}
