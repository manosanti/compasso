import { useCallback, useEffect, useRef, useState } from 'react'
import { LS, SV } from '../lib/storage'
import { hostOf, parseBRL, uid } from '../lib/format'
import {
  CAT_COLORS,
  DEFAULT_CATS,
  DEFAULT_META,
  DEFAULT_ROUTINE,
  DEFAULT_STOCK,
  DEFAULT_USER,
  DEFAULT_WISH,
  detect,
  genHistory,
  seedChecks,
} from '../lib/data'
import type {
  AccentKey,
  AuthForm,
  AuthMode,
  CatDialogState,
  Checks,
  DialogState,
  Meta,
  NotifPerm,
  Period,
  RoutineItem,
  Screen,
  Section,
  StockItem,
  Tab,
  Theme,
  User,
  WishCategory,
  WishItem,
  WishPreview,
} from '../types'

/** Day (midnight) offset from today. */
export function dateFor(off: number): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + off)
  return d
}

/** ISO date key (YYYY-MM-DD) for a Date. */
export function keyOf(d: Date): string {
  return d.toISOString().slice(0, 10)
}

const initialNotifPerm = (): NotifPerm =>
  typeof Notification !== 'undefined' ? (Notification.permission as NotifPerm) : 'default'

export interface Compasso {
  // state
  screen: Screen
  authMode: AuthMode
  form: AuthForm
  section: Section
  tab: Tab
  dateOffset: number
  theme: Theme
  accent: AccentKey
  routine: RoutineItem[]
  checks: Checks
  stock: StockItem[]
  wishlist: WishItem[]
  wishcats: WishCategory[]
  wishFilter: string
  meta: Meta
  newUrl: string
  preview: WishPreview | null
  loadingMagic: boolean
  settingsOpen: boolean
  dialog: DialogState | null
  catDialog: CatDialogState | null
  toast: string | null
  userMenuOpen: boolean
  user: User
  notifPerm: NotifPerm
  /** ticks every 30s to refresh time-derived UI. */
  tick: number

  // setters used directly by components
  setForm: (patch: Partial<AuthForm>) => void
  setAuthMode: (m: AuthMode) => void
  setSection: (s: Section) => void
  setTab: (t: Tab) => void
  setDateOffset: (n: number) => void
  setNewUrl: (v: string) => void
  setSettingsOpen: (v: boolean) => void
  setUserMenuOpen: (v: boolean) => void
  setDialog: (d: DialogState | null) => void
  patchDialog: (patch: Partial<DialogState>) => void
  setWishFilter: (id: string) => void
  setPreviewCat: (id: string) => void
  setCatDialog: (d: CatDialogState | null) => void
  patchCatDialog: (patch: Partial<CatDialogState>) => void

  // derived helpers
  pctFor: (off: number) => number
  streak: () => number

  // actions
  login: () => void
  logout: () => void
  toggleCheck: (id: string) => void
  addRoutine: (period: Period) => void
  addStock: () => void
  saveDialog: () => void
  delRoutine: (id: string) => void
  delStock: (id: string) => void
  repor: (id: string) => void
  runMagic: () => void
  saveWish: () => void
  delWish: (id: string) => void
  setWishCat: (id: string, cat: string | null) => void
  addCat: () => void
  saveCat: () => void
  delCat: (id: string) => void
  setTarget: (id: string, val: string) => void
  setMeta: (patch: Partial<Meta>) => void
  setTheme: (t: Theme) => void
  setAccent: (a: AccentKey) => void
  enableNotif: () => void
  testNotif: () => void
  flash: (msg: string) => void
}

export function useCompasso(): Compasso {
  const [screen, setScreen] = useState<Screen>(() => (LS<boolean>('cmp_logged') ? 'app' : 'login'))
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [form, setFormState] = useState<AuthForm>({ name: '', email: '', pass: '' })
  const [section, setSectionState] = useState<Section>(() => LS<Section>('cmp_section') || 'rotina')
  const [tab, setTab] = useState<Tab>('hoje')
  const [dateOffset, setDateOffset] = useState(0)
  const [theme, setThemeState] = useState<Theme>(() => LS<Theme>('cmp_theme') || 'light')
  const [accent, setAccentState] = useState<AccentKey>(() => LS<AccentKey>('cmp_accent') || 'teal')
  const [routine, setRoutine] = useState<RoutineItem[]>(() => LS<RoutineItem[]>('cmp_routine') || DEFAULT_ROUTINE)
  const [checks, setChecks] = useState<Checks>(() => LS<Checks>('cmp_checks') || {})
  const [stock, setStock] = useState<StockItem[]>(() => LS<StockItem[]>('cmp_stock') || DEFAULT_STOCK)
  const [wishlist, setWishlist] = useState<WishItem[]>(() => LS<WishItem[]>('cmp_wishlist') || DEFAULT_WISH)
  const [wishcats, setWishcats] = useState<WishCategory[]>(() => LS<WishCategory[]>('cmp_wishcats') || DEFAULT_CATS)
  const [wishFilter, setWishFilter] = useState<string>('all')
  const [meta, setMetaState] = useState<Meta>(() => LS<Meta>('cmp_meta') || DEFAULT_META)
  const [newUrl, setNewUrl] = useState('')
  const [preview, setPreview] = useState<WishPreview | null>(null)
  const [loadingMagic, setLoadingMagic] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [catDialog, setCatDialog] = useState<CatDialogState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<User>(() => LS<User>('cmp_user') || DEFAULT_USER)
  const [notifPerm, setNotifPerm] = useState<NotifPerm>(initialNotifPerm)
  const [tick, setTick] = useState(0)

  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  // Clock tick + one-time seeding of completion history.
  useEffect(() => {
    const clock = setInterval(() => setTick(Date.now()), 30000)

    setChecks((cur) => {
      const validIds = routine.map((r) => r.id)
      const vset = new Set(validIds)
      const keys = Object.keys(cur)
      const anyValid = keys.some((k) => (cur[k] || []).some((id) => vset.has(id)))
      if (!keys.length || !anyValid) {
        const seeded = seedChecks(validIds)
        SV('cmp_checks', seeded)
        return seeded
      }
      return cur
    })

    return () => clearInterval(clock)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flash = useCallback((msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  // ---- persistence-backed setters ------------------------------------------
  const setForm = useCallback((patch: Partial<AuthForm>) => setFormState((f) => ({ ...f, ...patch })), [])

  const setSection = useCallback((s: Section) => {
    SV('cmp_section', s)
    setSectionState(s)
  }, [])

  const setTheme = useCallback((t: Theme) => {
    SV('cmp_theme', t)
    setThemeState(t)
  }, [])

  const setAccent = useCallback((a: AccentKey) => {
    SV('cmp_accent', a)
    setAccentState(a)
  }, [])

  const persistRoutine = useCallback((next: RoutineItem[]) => {
    SV('cmp_routine', next)
    setRoutine(next)
  }, [])

  const persistChecks = useCallback((next: Checks) => {
    SV('cmp_checks', next)
    setChecks(next)
  }, [])

  const persistStock = useCallback((next: StockItem[]) => {
    SV('cmp_stock', next)
    setStock(next)
  }, [])

  const persistWish = useCallback((next: WishItem[]) => {
    SV('cmp_wishlist', next)
    setWishlist(next)
  }, [])

  const persistCats = useCallback((next: WishCategory[]) => {
    SV('cmp_wishcats', next)
    setWishcats(next)
  }, [])

  const patchCatDialog = useCallback(
    (patch: Partial<CatDialogState>) => setCatDialog((d) => (d ? { ...d, ...patch } : d)),
    [],
  )

  const setPreviewCat = useCallback((id: string) => setPreview((p) => (p ? { ...p, cat: id } : p)), [])

  const setMeta = useCallback(
    (patch: Partial<Meta>) =>
      setMetaState((m) => {
        const next = { ...m, ...patch }
        SV('cmp_meta', next)
        return next
      }),
    [],
  )

  // ---- derived -------------------------------------------------------------
  const pctFor = useCallback(
    (off: number) => {
      const total = routine.length
      if (!total) return 0
      const k = keyOf(dateFor(off))
      const done = (checks[k] || []).length
      return Math.round((done / total) * 100)
    },
    [routine.length, checks],
  )

  const streak = useCallback(() => {
    let n = 0
    for (let i = 0; i < 400; i++) {
      if (pctFor(-i) > 0) n++
      else if (i > 0) break
    }
    return n
  }, [pctFor])

  // ---- actions -------------------------------------------------------------
  const login = useCallback(() => {
    const email = (form.email || '').trim() || 'voce@email.com'
    const name =
      (form.name || '').trim() ||
      email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    const nextUser = { name, email }
    SV('cmp_user', nextUser)
    SV('cmp_logged', true)
    setUser(nextUser)
    setScreen('app')
  }, [form])

  const logout = useCallback(() => {
    SV('cmp_logged', false)
    setScreen('login')
    setSettingsOpen(false)
    setUserMenuOpen(false)
  }, [])

  const toggleCheck = useCallback(
    (id: string) => {
      const k = keyOf(dateFor(dateOffset))
      const next: Checks = { ...checks }
      const set = new Set(next[k] || [])
      set.has(id) ? set.delete(id) : set.add(id)
      next[k] = [...set]
      persistChecks(next)
    },
    [checks, dateOffset, persistChecks],
  )

  const addRoutine = useCallback((period: Period) => {
    setDialog({
      kind: 'routine',
      period,
      title: 'Novo item da rotina',
      l1: 'Nome',
      p1: 'Ex: Tomar vitamina',
      v1: '',
      l2: 'Horário (opcional)',
      p2: '08:00',
      v2: '',
      l3: 'Quantidade (opcional)',
      p3: '1 comp.',
      v3: '',
    })
  }, [])

  const addStock = useCallback(() => {
    setDialog({
      kind: 'stock',
      title: 'Novo item de estoque',
      l1: 'Nome',
      p1: 'Ex: Ômega 3',
      v1: '',
      l2: 'Quantidade / Total',
      p2: '30 / 60',
      v2: '',
      l3: 'Preço',
      p3: 'R$ 40,00',
      v3: '',
    })
  }, [])

  const patchDialog = useCallback((patch: Partial<DialogState>) => setDialog((d) => (d ? { ...d, ...patch } : d)), [])

  const saveDialog = useCallback(() => {
    const d = dialog
    if (!d || !d.v1.trim()) {
      setDialog(null)
      return
    }
    if (d.kind === 'routine') {
      const item: RoutineItem = {
        id: uid(),
        name: d.v1.trim(),
        period: d.period ?? 'manha',
        time: d.v2.trim() || undefined,
        qty: d.v3.trim() || undefined,
      }
      persistRoutine([...routine, item])
      flash('Item adicionado à rotina')
    } else {
      const parts = (d.v2 || '').split('/')
      const qty = parseInt(parts[0]) || 0
      const total = parseInt(parts[1]) || qty || 30
      const item: StockItem = {
        id: uid(),
        name: d.v1.trim(),
        unit: 'un.',
        qty,
        total,
        perDay: 1,
        price: parseBRL(d.v3),
      }
      persistStock([...stock, item])
      flash('Item adicionado ao estoque')
    }
    setDialog(null)
  }, [dialog, routine, stock, persistRoutine, persistStock, flash])

  const delRoutine = useCallback(
    (id: string) => persistRoutine(routine.filter((r) => r.id !== id)),
    [routine, persistRoutine],
  )
  const delStock = useCallback((id: string) => persistStock(stock.filter((s) => s.id !== id)), [stock, persistStock])
  const repor = useCallback(
    (id: string) => {
      persistStock(stock.map((s) => (s.id === id ? { ...s, qty: s.total } : s)))
      flash('Estoque reposto')
    },
    [stock, persistStock, flash],
  )

  const runMagic = useCallback(() => {
    const url = newUrl.trim()
    if (!url) {
      flash('Cole um link primeiro')
      return
    }
    setLoadingMagic(true)
    setPreview(null)
    setTimeout(() => {
      const c = detect(url)
      const defCat = wishFilter !== 'all' ? wishFilter : wishcats[0]?.id ?? null
      setLoadingMagic(false)
      setPreview({ name: c.name, price: c.price, letter: c.l, c1: c.c1, c2: c.c2, host: hostOf(url), cat: defCat })
    }, 850)
  }, [newUrl, wishFilter, wishcats, flash])

  const saveWish = useCallback(() => {
    const p = preview
    if (!p) return
    const item: WishItem = {
      id: uid(),
      name: p.name,
      host: p.host,
      letter: p.letter,
      c1: p.c1,
      c2: p.c2,
      saved: p.price,
      hist: genHistory(p.price),
      target: Math.round(p.price * 0.9),
      cat: p.cat || null,
    }
    persistWish([item, ...wishlist])
    setPreview(null)
    setNewUrl('')
    flash('Adicionado à wishlist')
  }, [preview, wishlist, persistWish, flash])

  const delWish = useCallback((id: string) => persistWish(wishlist.filter((w) => w.id !== id)), [wishlist, persistWish])

  const setWishCat = useCallback(
    (id: string, cat: string | null) => persistWish(wishlist.map((w) => (w.id === id ? { ...w, cat } : w))),
    [wishlist, persistWish],
  )

  const addCat = useCallback(() => setCatDialog({ name: '' }), [])

  const saveCat = useCallback(() => {
    const name = (catDialog?.name || '').trim()
    if (!name) {
      setCatDialog(null)
      return
    }
    const color = CAT_COLORS[wishcats.length % CAT_COLORS.length]
    const cat: WishCategory = { id: uid(), name, color }
    persistCats([...wishcats, cat])
    setCatDialog(null)
    setWishFilter(cat.id)
    flash('Categoria criada')
  }, [catDialog, wishcats, persistCats, flash])

  const delCat = useCallback(
    (id: string) => {
      persistCats(wishcats.filter((c) => c.id !== id))
      persistWish(wishlist.map((w) => (w.cat === id ? { ...w, cat: null } : w)))
      setWishFilter((f) => (f === id ? 'all' : f))
    },
    [wishcats, wishlist, persistCats, persistWish],
  )
  const setTarget = useCallback(
    (id: string, val: string) => persistWish(wishlist.map((w) => (w.id === id ? { ...w, target: parseBRL(val) } : w))),
    [wishlist, persistWish],
  )

  const enableNotif = useCallback(() => {
    if (typeof Notification === 'undefined') {
      flash('Notificações não suportadas aqui')
      return
    }
    Notification.requestPermission().then((p) => {
      setNotifPerm(p as NotifPerm)
      flash(p === 'granted' ? 'Notificações ativadas' : 'Permissão negada')
    })
  }, [flash])

  const testNotif = useCallback(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('Compasso', { body: 'Hora de tomar o Remédio de pressão' })
    }
    flash('Lembrete: Remédio de pressão — 14:00')
  }, [flash])

  return {
    screen,
    authMode,
    form,
    section,
    tab,
    dateOffset,
    theme,
    accent,
    routine,
    checks,
    stock,
    wishlist,
    wishcats,
    wishFilter,
    meta,
    newUrl,
    preview,
    loadingMagic,
    settingsOpen,
    dialog,
    catDialog,
    toast,
    userMenuOpen,
    user,
    notifPerm,
    tick,

    setForm,
    setAuthMode,
    setSection,
    setTab,
    setDateOffset,
    setNewUrl,
    setSettingsOpen,
    setUserMenuOpen,
    setDialog,
    patchDialog,
    setWishFilter,
    setPreviewCat,
    setCatDialog,
    patchCatDialog,

    pctFor,
    streak,

    login,
    logout,
    toggleCheck,
    addRoutine,
    addStock,
    saveDialog,
    delRoutine,
    delStock,
    repor,
    runMagic,
    saveWish,
    delWish,
    setWishCat,
    addCat,
    saveCat,
    delCat,
    setTarget,
    setMeta,
    setTheme,
    setAccent,
    enableNotif,
    testNotif,
    flash,
  }
}
