import type { CSSProperties } from 'react'
import type { Compasso } from '../hooks/useCompasso'
import { dateFor, keyOf } from '../hooks/useCompasso'
import { PERIOD_ICON, PERIOD_META, PERIOD_ORDER } from '../lib/data'
import type { Period } from '../types'
import { Icon, PathIcon } from './Icon'

const tbase: CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  padding: '4px 9px',
  borderRadius: '999px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  whiteSpace: 'nowrap',
}
const tb = (color: string, bg: string): CSSProperties => ({ ...tbase, color, background: bg })

export function Hoje({ app }: { app: Compasso }) {
  const d = dateFor(app.dateOffset)
  const dk = keyOf(d)
  const doneSet = new Set(app.checks[dk] || [])
  const dateLabel = d.toLocaleDateString('pt-BR')
  const weekdayLabel = d.toLocaleDateString('pt-BR', { weekday: 'long' })
  const total = app.routine.length
  const doneN = doneSet.size
  const pctToday = total ? Math.round((doneN / total) * 100) : 0
  const st = app.streak()

  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const accentBadge = tb('var(--color-accent-strong)', 'var(--color-accent-weak)')

  const streakLabel = st > 0 ? `${st} ${st === 1 ? 'dia seguido' : 'dias seguidos'}` : 'Comece hoje!'

  const periods = PERIOD_ORDER.map((pk: Period) => {
    const items = app.routine
      .filter((r) => r.period === pk)
      .map((r) => {
        const done = doneSet.has(r.id)
        const metaBits: string[] = []
        if (r.stock) metaBits.push('Consome de: ' + r.stock)
        if (r.qty) metaBits.push(r.qty)

        let timeStyle = accentBadge
        let timeLabel = r.time || ''
        if (r.time && !done && app.dateOffset === 0) {
          const parts = r.time.split(':')
          const itemMin = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0)
          const diff = itemMin - nowMin
          if (diff < 0) {
            timeStyle = tb('#dc2626', 'color-mix(in srgb,#dc2626 15%,transparent)')
            timeLabel = r.time + '  atrasado'
          } else if (diff <= 15) {
            timeStyle = tb('#ea580c', 'color-mix(in srgb,#ea580c 17%,transparent)')
            timeLabel = r.time + '  em ' + diff + 'min'
          } else if (diff <= 30) {
            timeStyle = tb('#f59e0b', 'color-mix(in srgb,#f59e0b 20%,transparent)')
            timeLabel = r.time + '  em ' + diff + 'min'
          } else if (diff <= 60) {
            timeStyle = accentBadge
            timeLabel = r.time + '  !'
          }
        }

        return {
          id: r.id,
          name: r.name,
          done,
          time: r.time || '',
          timeStyle,
          timeLabel,
          meta: metaBits.join('  ·  '),
        }
      })
    const dn = items.filter((i) => i.done).length
    return { key: pk, label: PERIOD_META[pk].label, count: `${dn}/${items.length}`, items }
  })

  return (
    <div style={{ animation: 'cmpFade .25s ease' }}>
      {/* Date navigator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '16px',
        }}
      >
        <button className="btn btn-icon cmp-tab" onClick={() => app.setDateOffset(app.dateOffset - 1)}>
          <Icon size={19}>
            <path d="M15 18l-6-6 6-6" />
          </Icon>
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', fontVariantNumeric: 'tabular-nums' }}>
            {dateLabel}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'capitalize' }}>
            {weekdayLabel}
          </div>
        </div>
        <button className="btn btn-icon cmp-tab" onClick={() => app.setDateOffset(app.dateOffset + 1)}>
          <Icon size={19}>
            <path d="M9 18l6-6-6-6" />
          </Icon>
        </button>
      </div>

      {/* Progress banner */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(140deg, var(--color-accent), var(--color-accent-strong))',
          color: '#fff',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '30px',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              {pctToday}%
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Conclusão de hoje</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>{`${doneN} de ${total} itens concluídos`}</div>
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'rgba(255,255,255,.2)',
              padding: '5px 11px',
              borderRadius: '999px',
              flex: 'none',
            }}
          >
            <Icon size={13} strokeWidth={2}>
              <path d="M13 2L4.09 12.97a1 1 0 0 0 .77 1.63H11l-1 7.4 8.91-10.97a1 1 0 0 0-.77-1.63H12z" />
            </Icon>
            {streakLabel}
          </div>
        </div>
        <div style={{ height: '7px', borderRadius: '6px', background: 'rgba(255,255,255,.25)', marginTop: '13px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pctToday}%`, background: '#fff', borderRadius: '6px', transition: 'width .35s' }} />
        </div>
      </div>

      {/* Period groups */}
      {periods.map((p) => (
        <div key={p.key} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '11px', padding: '0 4px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 700,
                color: 'color-mix(in srgb, var(--color-text) 78%, transparent)',
              }}
            >
              <span style={{ color: 'var(--color-accent)', display: 'flex' }}>
                <PathIcon paths={PERIOD_ICON[p.key]} size={16} />
              </span>
              {p.label}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--color-accent)' }}>
              {p.count}
            </span>
          </div>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            {p.items.map((it) => (
              <div
                key={it.id}
                className="cmp-row"
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 16px', borderBottom: '1px solid var(--color-divider)' }}
              >
                <button
                  className="cmp-ck"
                  onClick={() => app.toggleCheck(it.id)}
                  style={{
                    width: '26px',
                    height: '26px',
                    flex: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                    border: `2px solid ${it.done ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 28%, transparent)'}`,
                    background: it.done ? 'var(--color-accent)' : 'transparent',
                  }}
                >
                  {it.done && (
                    <Icon size={14} stroke="#fff" strokeWidth={3.2}>
                      <path d="M20 6L9 17l-5-5" />
                    </Icon>
                  )}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 500, ...(it.done ? { textDecoration: 'line-through', opacity: 0.45 } : {}) }}>
                    {it.name}
                  </div>
                  {it.meta && (
                    <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 50%, transparent)', marginTop: '3px' }}>
                      {it.meta}
                    </div>
                  )}
                </div>
                {it.time && (
                  <span style={it.timeStyle}>
                    <Icon size={12} strokeWidth={1.9}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </Icon>
                    {it.timeLabel}
                  </span>
                )}
                <button
                  className="btn btn-icon cmp-tab cmp-del"
                  onClick={() => app.delRoutine(it.id)}
                  style={{ width: '32px', height: '32px' }}
                >
                  <Icon size={16} strokeWidth={1.7}>
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </Icon>
                </button>
              </div>
            ))}
            <button
              className="cmp-tab"
              onClick={() => app.addRoutine(p.key)}
              style={{
                width: '100%',
                padding: '13px',
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '13px',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Icon size={16} strokeWidth={1.9}>
                <path d="M12 5v14M5 12h14" />
              </Icon>
              Adicionar item
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
