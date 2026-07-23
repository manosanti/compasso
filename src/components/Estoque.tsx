import type { CSSProperties } from 'react'
import type { Compasso } from '../hooks/useCompasso'
import { dateFor } from '../hooks/useCompasso'
import { BRL } from '../lib/format'
import { Icon } from './Icon'

const ONE_DAY = 86400000

export function Estoque({ app }: { app: Compasso }) {
  const today0 = dateFor(0)

  const view = app.stock.map((s) => {
    const daysLeft = Math.floor(s.qty / (s.perDay || 1))
    const pct = Math.round((s.qty / s.total) * 100)

    let badge: string
    let badgeBg: string
    let badgeColor: string
    let cardBorder = 'transparent'
    let bar = 'var(--color-accent)'
    if (daysLeft < 7) {
      badge = 'Comprar urgente'
      badgeBg = 'color-mix(in srgb,#dc2626 14%,transparent)'
      badgeColor = '#dc2626'
      cardBorder = 'color-mix(in srgb,#dc2626 45%,transparent)'
      bar = '#dc2626'
    } else if (daysLeft < 14) {
      badge = 'Estoque baixo'
      badgeBg = 'color-mix(in srgb,#f59e0b 20%,transparent)'
      badgeColor = '#b45309'
      cardBorder = 'color-mix(in srgb,#f59e0b 55%,transparent)'
      bar = '#f59e0b'
    } else {
      badge = 'Em dia'
      badgeBg = 'color-mix(in srgb,#16a34a 15%,transparent)'
      badgeColor = '#15803d'
    }

    const rd = new Date(today0.getTime() + daysLeft * ONE_DAY)
    const badgeStyle: CSSProperties = {
      fontSize: '12px',
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: '999px',
      background: badgeBg,
      color: badgeColor,
    }
    return {
      id: s.id,
      name: s.name,
      rateLabel: `${s.perDay || 1}/dia`,
      badge,
      badgeStyle,
      sub: `${s.unit}  ·  ${BRL(s.price)}`,
      qtyLabel: `${s.qty} / ${s.total}`,
      pct,
      barColor: bar,
      daysLabel: `${daysLeft} dias`,
      restock: rd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      cardBorder,
    }
  })

  return (
    <div style={{ animation: 'cmpFade .25s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h4 style={{ fontSize: '22px', margin: '0 0 4px' }}>Meu estoque</h4>
          <p style={{ fontSize: '13px', margin: 0, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
            Remédios, vitaminas, skincare — tudo que você consome e não pode deixar acabar.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => app.addStock()} style={{ flex: 'none' }}>
          <Icon size={16} strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </Icon>
          Novo
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {view.map((s) => (
          <div
            key={s.id}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '18px',
              border: `1.5px solid ${s.cardBorder}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px' }}>{s.name}</span>
                  <span className="tag tag-neutral">{s.rateLabel}</span>
                  <span style={s.badgeStyle}>{s.badge}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginTop: '5px' }}>
                  {s.sub}
                </div>
              </div>
              <button className="btn btn-icon cmp-tab cmp-del" onClick={() => app.delStock(s.id)} style={{ width: '32px', height: '32px' }}>
                <Icon size={16} strokeWidth={1.7}>
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </Icon>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontVariantNumeric: 'tabular-nums', fontSize: '14px', marginBottom: '7px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{s.qtyLabel}</span>
              <span style={{ fontWeight: 600, color: 'color-mix(in srgb, var(--color-text) 52%, transparent)' }}>{s.pct}%</span>
            </div>
            <div style={{ height: '9px', borderRadius: '6px', background: 'color-mix(in srgb, var(--color-text) 8%, transparent)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.pct}%`, background: s.barColor, borderRadius: '6px', transition: 'width .35s' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0 14px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', fontVariantNumeric: 'tabular-nums' }}>
                  {s.daysLabel}
                </div>
                <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>de estoque restantes</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px' }}>{s.restock}</div>
                <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}>reposição estimada</div>
              </div>
            </div>

            <button className="btn btn-secondary btn-block cmp-tab" onClick={() => app.repor(s.id)}>
              <Icon size={16} strokeWidth={1.7}>
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </Icon>
              Repor estoque
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
