import type { CSSProperties } from 'react'
import type { Compasso } from '../hooks/useCompasso'
import { dateFor, keyOf } from '../hooks/useCompasso'

const DOWS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

function cellStyle(pct: number, past: boolean, isToday: boolean, small: boolean, metaMin: number): CSSProperties {
  let bg: string
  let color: string
  if (isToday) {
    bg = 'var(--color-accent)'
    color = '#fff'
  } else if (pct >= metaMin) {
    bg = 'color-mix(in srgb, #16a34a 20%, transparent)'
    color = '#15803d'
  } else if (pct > 0) {
    bg = 'var(--color-accent-weak)'
    color = 'var(--color-accent-strong)'
  } else if (past) {
    bg = 'color-mix(in srgb, #dc2626 14%, transparent)'
    color = '#dc2626'
  } else {
    bg = 'color-mix(in srgb, var(--color-text) 5%, transparent)'
    color = 'color-mix(in srgb, var(--color-text) 40%, transparent)'
  }
  return {
    aspectRatio: '1',
    display: 'grid',
    placeItems: 'center',
    borderRadius: small ? '10px' : '12px',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: small ? '12px' : '15px',
    background: bg,
    color,
  }
}

export function Semana({ app }: { app: Compasso }) {
  const total = app.routine.length
  const today0 = dateFor(0)
  const todayKey = keyOf(today0)
  const metaMin = app.meta.min

  const pctForKey = (ck: string) => (app.checks[ck] ? Math.round((app.checks[ck].length / (total || 1)) * 100) : 0)

  // Week (Mon-Sun) containing today.
  const startOfWeek = (() => {
    const t = dateFor(0)
    const day = (t.getDay() + 6) % 7
    const s = new Date(t)
    s.setDate(t.getDate() - day)
    return s
  })()

  let weekSum = 0
  let weekCount = 0
  const weekDays = DOWS.map((dow, i) => {
    const cd = new Date(startOfWeek)
    cd.setDate(startOfWeek.getDate() + i)
    const ck = keyOf(cd)
    const isToday = ck === todayKey
    const past = cd < today0
    const pct = pctForKey(ck)
    if (past || isToday) {
      weekSum += pct
      weekCount++
    }
    return { num: cd.getDate(), dow, style: cellStyle(pct, past, isToday, false, metaMin) }
  })
  const weekAvg = weekCount ? Math.round(weekSum / weekCount) : 0

  // Current month.
  const daysInMonth = new Date(today0.getFullYear(), today0.getMonth() + 1, 0).getDate()
  let mSum = 0
  let mCount = 0
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const cd = new Date(today0.getFullYear(), today0.getMonth(), i + 1)
    const ck = keyOf(cd)
    const isToday = ck === todayKey
    const past = cd < today0
    const pct = pctForKey(ck)
    if (past || isToday) {
      mSum += pct
      mCount++
    }
    return { num: i + 1, style: cellStyle(pct, past, isToday, true, metaMin) }
  })
  const monthAvg = mCount ? Math.round(mSum / mCount) : 0

  return (
    <div style={{ animation: 'cmpFade .25s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Week card */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <h4 style={{ fontSize: '20px', margin: 0 }}>Esta semana</h4>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '26px', fontVariantNumeric: 'tabular-nums', color: 'var(--color-accent)' }}>
              {weekAvg}%
            </div>
            <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 52%, transparent)' }}>média do período</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '8px' }}>
          {weekDays.map((dd, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={dd.style}>{dd.num}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '6px', color: 'color-mix(in srgb, var(--color-text) 48%, transparent)' }}>
                {dd.dow}
              </div>
            </div>
          ))}
        </div>

        {/* Goal controls */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-divider)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Meta mínima</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '17px', fontVariantNumeric: 'tabular-nums', color: 'var(--color-accent)' }}>
              {app.meta.min}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={app.meta.min}
            onChange={(e) => app.setMeta({ min: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '18px' }}>
            <div className="field">
              <label>Recompensa se atingir</label>
              <input className="input" value={app.meta.reward} onChange={(e) => app.setMeta({ reward: e.target.value })} placeholder="Ex: capinha nova" />
            </div>
            <div className="field">
              <label>Punição se falhar</label>
              <input className="input" value={app.meta.punish} onChange={(e) => app.setMeta({ punish: e.target.value })} placeholder="Ex: sem delivery" />
            </div>
          </div>
        </div>
      </div>

      {/* Month card */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <h4 style={{ fontSize: '20px', margin: 0 }}>Este mês</h4>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '26px', fontVariantNumeric: 'tabular-nums', color: 'var(--color-accent)' }}>
              {monthAvg}%
            </div>
            <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 52%, transparent)' }}>média do período</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: '7px' }}>
          {monthDays.map((m, i) => (
            <div key={i} style={m.style}>
              {m.num}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
