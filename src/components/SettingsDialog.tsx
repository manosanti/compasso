import type { Compasso } from '../hooks/useCompasso'
import { ACCENT_KEYS, ACCENTS } from '../lib/theme'
import { segStyle } from '../lib/styles'
import { Icon } from './Icon'

export function SettingsDialog({ app }: { app: Compasso }) {
  if (!app.settingsOpen) return null

  const notifLabel = app.notifPerm === 'granted' ? 'Ativadas' : 'Permitir notificações'

  return (
    <div className="dialog-backdrop" onClick={() => app.setSettingsOpen(false)}>
      <div className="dialog" onClick={(e) => e.stopPropagation()} style={{ width: 'min(470px, 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="dialog-title">Ajustes</span>
          <button className="btn btn-icon cmp-tab" onClick={() => app.setSettingsOpen(false)}>
            <Icon size={19}>
              <path d="M18 6L6 18M6 6l12 12" />
            </Icon>
          </button>
        </div>

        {/* Theme */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '9px' }}>Tema</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="cmp-tab" onClick={() => app.setTheme('light')} style={segStyle(app.theme === 'light')}>
              <Icon size={17} strokeWidth={1.7}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
              </Icon>
              Claro
            </button>
            <button className="cmp-tab" onClick={() => app.setTheme('dark')} style={segStyle(app.theme === 'dark')}>
              <Icon size={17} strokeWidth={1.7}>
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </Icon>
              Escuro
            </button>
          </div>
        </div>

        {/* Accent */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>Cor de destaque</div>
          <div style={{ display: 'flex', gap: '14px' }}>
            {ACCENT_KEYS.map((k) => {
              const a = ACCENTS[k]
              const sel = app.accent === k
              return (
                <button
                  key={k}
                  className="cmp-swatch"
                  onClick={() => app.setAccent(k)}
                  title={a.name}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: a.base,
                    border: `3px solid ${sel ? 'var(--color-surface)' : 'transparent'}`,
                    boxShadow: sel ? `0 0 0 2px ${a.base}` : 'none',
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="hr" />

        {/* Notifications */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Notificações</div>
          <p style={{ fontSize: '13px', margin: '0 0 12px', color: 'color-mix(in srgb, var(--color-text) 58%, transparent)' }}>
            Permita os lembretes para o Compasso avisar a hora de tomar ou fazer cada item da rotina.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => app.enableNotif()}>
              {notifLabel}
            </button>
            <button className="btn btn-ghost" onClick={() => app.testNotif()}>
              Testar lembrete
            </button>
          </div>
        </div>

        <div className="hr" />
        <button className="btn btn-secondary btn-block" onClick={() => app.logout()}>
          Sair da conta
        </button>
      </div>
    </div>
  )
}
