import type { ReactNode } from 'react'
import type { Compasso } from '../hooks/useCompasso'
import { Icon } from './Icon'

function initialsOf(name: string, email: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return initials || email[0].toUpperCase()
}

export function Header({ app }: { app: Compasso }) {
  const uName = (app.user.name || '').trim() || 'Lucas Santiago'
  const uEmail = (app.user.email || '').trim() || 'lucas.santiago@email.com'
  const initials = initialsOf(uName, uEmail)

  const now = new Date()
  const nowTime =
    String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-divider)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <header
        style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '1120px', margin: '0 auto', padding: '12px 24px' }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'var(--color-accent)',
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            flex: 'none',
          }}
        >
          <Icon size={20} strokeWidth={1.9}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 12l4-2" />
            <path d="M12 12l-2 4" />
          </Icon>
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', lineHeight: 1 }}>Compasso</div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '14px',
              fontVariantNumeric: 'tabular-nums',
              color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
            }}
          >
            <Icon size={15} stroke="var(--color-accent)" strokeWidth={1.9}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </Icon>
            {nowTime}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              className="cmp-user"
              onClick={(e) => {
                e.stopPropagation()
                app.setUserMenuOpen(!app.userMenuOpen)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '5px 8px 5px 5px',
                background: 'transparent',
                border: 0,
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  flex: 'none',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                {initials}
              </span>
              <span style={{ textAlign: 'left', lineHeight: 1.15, maxWidth: '150px' }}>
                <span
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: 'var(--color-text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {uName}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    color: 'color-mix(in srgb, var(--color-text) 50%, transparent)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {uEmail}
                </span>
              </span>
              <Icon
                size={16}
                stroke="color-mix(in srgb, var(--color-text) 50%, transparent)"
                style={{ transition: 'transform .18s', transform: `rotate(${app.userMenuOpen ? '180deg' : '0deg'})` }}
              >
                <path d="M6 9l6 6 6-6" />
              </Icon>
            </button>

            {app.userMenuOpen && (
              <div>
                <div onClick={() => app.setUserMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '250px',
                    zIndex: 31,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-divider)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden',
                    animation: 'cmpFade .16s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
                    <span
                      style={{
                        width: '42px',
                        height: '42px',
                        flex: 'none',
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '17px',
                      }}
                    >
                      {initials}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          fontSize: '15px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {uName}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'color-mix(in srgb, var(--color-text) 52%, transparent)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {uEmail}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '4px 0 6px', borderTop: '1px solid var(--color-divider)' }}>
                    <MenuButton
                      onClick={() => {
                        app.setUserMenuOpen(false)
                        app.flash('Perfil em breve')
                      }}
                    >
                      <Icon size={17} strokeWidth={1.7}>
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </Icon>
                      Meu perfil
                    </MenuButton>
                    <MenuButton
                      onClick={() => {
                        app.setUserMenuOpen(false)
                        app.setSettingsOpen(true)
                      }}
                    >
                      <Icon size={17} strokeWidth={1.6}>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </Icon>
                      Ajustes
                    </MenuButton>
                    <MenuButton danger onClick={() => app.logout()}>
                      <Icon size={17} strokeWidth={1.7}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                      </Icon>
                      Sair da conta
                    </MenuButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

function MenuButton({
  children,
  onClick,
  danger,
}: {
  children: ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      className={`cmp-menu-item${danger ? ' cmp-del' : ''}`}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '11px',
        padding: '11px 16px',
        background: 'transparent',
        border: 0,
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: danger ? undefined : 'var(--color-text)',
        textAlign: 'left',
      }}
    >
      {children}
    </button>
  )
}
