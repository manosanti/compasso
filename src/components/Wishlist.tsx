import type { Compasso } from '../hooks/useCompasso'
import { BRL } from '../lib/format'
import { polyPoints } from '../lib/data'
import { catBadgeStyle, chipStyle, dotStyle } from '../lib/styles'
import { Icon, WishThumb } from './Icon'

export function Wishlist({ app }: { app: Compasso }) {
  const preview = app.preview

  const catById = new Map(app.wishcats.map((c) => [c.id, c]))

  // Filter chips: "Todos" + one per category.
  const chips = [{ id: 'all', name: 'Todos', color: null as string | null, count: app.wishlist.length }].concat(
    app.wishcats.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color as string | null,
      count: app.wishlist.filter((w) => w.cat === c.id).length,
    })),
  )

  const filtered = app.wishFilter === 'all' ? app.wishlist : app.wishlist.filter((w) => w.cat === app.wishFilter)

  const view = filtered.map((w) => {
    const now = w.hist[w.hist.length - 1]
    const dropped = now < w.saved
    const hitTarget = now <= w.target
    const cat = w.cat ? catById.get(w.cat) : undefined
    return {
      id: w.id,
      name: w.name,
      host: w.host,
      letter: w.letter || '?',
      c1: w.c1 || '#475569',
      c2: w.c2 || '#1e293b',
      savedLabel: BRL(w.saved),
      nowLabel: BRL(now),
      nowColor: dropped ? '#16a34a' : 'var(--color-accent)',
      dropped,
      dropLabel: BRL(w.saved - now),
      hitTarget,
      cat,
      points: polyPoints(w.hist),
      target: BRL(w.target),
    }
  })

  return (
    <div style={{ animation: 'cmpFade .25s ease' }}>
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontSize: '22px', margin: '0 0 4px' }}>Wishlist</h4>
        <p style={{ fontSize: '13px', margin: 0, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
          Cole o link do produto — a gente lê nome, imagem e preço, e acompanha as quedas.
        </p>
      </div>

      {/* Category filter chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          {chips.map((c) => (
            <button
              key={c.id}
              className="cmp-tab"
              onClick={() => app.setWishFilter(c.id)}
              style={chipStyle(app.wishFilter === c.id, c.color)}
            >
              {c.color && <span style={dotStyle(c.color)} />}
              {c.name}
              <span style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>{c.count}</span>
            </button>
          ))}
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => app.addCat()}
          style={{ flex: 'none', borderRadius: '999px', padding: '7px 15px', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}
        >
          <Icon size={14} strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </Icon>
          Nova categoria
        </button>
      </div>

      {/* URL reader */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '18px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            className="input"
            value={app.newUrl}
            onChange={(e) => app.setNewUrl(e.target.value)}
            placeholder="https://loja.com/produto..."
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => app.runMagic()} style={{ flex: 'none', whiteSpace: 'nowrap' }}>
            {app.loadingMagic ? (
              <Icon size={16} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
              </Icon>
            ) : (
              <Icon size={16} strokeWidth={1.7}>
                <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 6.5L22 12l-6.5 2.5L13 21l-2.5-6.5L4 12l6.5-2.5z" />
              </Icon>
            )}
            Ler produto
          </button>
        </div>
        <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 45%, transparent)', marginTop: '11px' }}>
          Tente com um link da Amazon, Mercado Livre, Shopee, Nike ou Apple para ver a mágica.
        </div>

        {preview && (
          <>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                marginTop: '18px',
                paddingTop: '18px',
                borderTop: '1px solid var(--color-divider)',
                animation: 'cmpFade .3s ease',
              }}
            >
              <WishThumb letter={preview.letter} c1={preview.c1} c2={preview.c2} size={76} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px' }}>{preview.name}</div>
                <div style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--color-text) 52%, transparent)' }}>{preview.host}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '21px',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--color-accent)',
                    marginTop: '5px',
                  }}
                >
                  {BRL(preview.price)}
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => app.saveWish()} style={{ flex: 'none' }}>
                Salvar
              </button>
            </div>

            {app.wishcats.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginRight: '2px' }}>
                  Categoria:
                </span>
                {app.wishcats.map((c) => (
                  <button
                    key={c.id}
                    className="cmp-tab"
                    onClick={() => app.setPreviewCat(c.id)}
                    style={chipStyle(preview.cat === c.id, c.color)}
                  >
                    <span style={dotStyle(c.color)} />
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Saved wishes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {view.map((w) => (
          <div key={w.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '16px', display: 'flex', gap: '16px' }}>
            <WishThumb letter={w.letter} c1={w.c1} c2={w.c2} size={92} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px' }}>{w.name}</span>
                    {w.dropped && (
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          background: 'color-mix(in srgb, #16a34a 15%, transparent)',
                          color: '#15803d',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Icon size={12} strokeWidth={2.4}>
                          <path d="M12 5v14M19 12l-7 7-7-7" />
                        </Icon>
                        Baixou {w.dropLabel}
                      </span>
                    )}
                    {w.hitTarget && (
                      <span className="tag tag-accent">
                        <Icon size={12} strokeWidth={2}>
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="5" />
                          <circle cx="12" cy="12" r="1" />
                        </Icon>
                        Meta atingida
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                    {w.cat && (
                      <span style={catBadgeStyle(w.cat.color)}>
                        <span style={dotStyle(w.cat.color)} />
                        {w.cat.name}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 48%, transparent)' }}>{w.host}</span>
                  </div>
                </div>
                <button className="btn btn-icon cmp-tab cmp-del" onClick={() => app.delWish(w.id)} style={{ width: '30px', height: '30px' }}>
                  <Icon size={15} strokeWidth={1.7}>
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </Icon>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', margin: '12px 0 10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--color-text) 48%, transparent)' }}>Salvei por</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px', fontVariantNumeric: 'tabular-nums', textDecoration: 'line-through', opacity: 0.6 }}>
                    {w.savedLabel}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--color-text) 48%, transparent)' }}>Agora</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', fontVariantNumeric: 'tabular-nums', color: w.nowColor }}>
                    {w.nowLabel}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <svg width="100%" height="46" viewBox="0 0 220 46" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <polyline fill="none" stroke={w.nowColor} strokeWidth={2} points={w.points} strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', paddingTop: '11px', borderTop: '1px solid var(--color-divider)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
                  <Icon size={13} strokeWidth={1.7}>
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
                  </Icon>
                  Avisar quando chegar a
                </span>
                <input
                  className="input"
                  value={w.target}
                  onChange={(e) => app.setTarget(w.id, e.target.value)}
                  style={{ width: '120px', minHeight: '36px', fontVariantNumeric: 'tabular-nums' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
