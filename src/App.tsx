import { useCompasso } from './hooks/useCompasso'
import { themeVars } from './lib/theme'
import { navStyle, tabBtnStyle } from './lib/styles'
import type { Tab } from './types'
import { Login } from './components/Login'
import { Header } from './components/Header'
import { Hoje } from './components/Hoje'
import { Semana } from './components/Semana'
import { Estoque } from './components/Estoque'
import { Wishlist } from './components/Wishlist'
import { SettingsDialog } from './components/SettingsDialog'
import { AddDialog } from './components/AddDialog'
import { CatDialog } from './components/CatDialog'
import { Toast } from './components/Toast'
import { Icon } from './components/Icon'

const ROTINA_TABS: { key: Tab; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Semana' },
  { key: 'estoque', label: 'Estoque' },
]

export default function App() {
  const app = useCompasso()
  const rootStyle = themeVars(app.accent, app.theme)

  if (app.screen === 'login') {
    return (
      <div className="cmp-app" style={rootStyle}>
        <Login app={app} />
        <Toast message={app.toast} />
      </div>
    )
  }

  const isRotina = app.section === 'rotina'

  return (
    <div className="cmp-app" style={rootStyle}>
      <Header app={app} />

      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '22px 24px 90px' }}>
        {/* Section nav */}
        <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid var(--color-divider)', marginBottom: '24px' }}>
          <button className="cmp-tab" onClick={() => app.setSection('rotina')} style={navStyle(isRotina)}>
            <Icon size={17} strokeWidth={1.7}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M8 2v4M16 2v4M3 10h18M9 16l2 2 4-4" />
            </Icon>
            Rotina
          </button>
          <button className="cmp-tab" onClick={() => app.setSection('wishlist')} style={navStyle(app.section === 'wishlist')}>
            <Icon size={17} strokeWidth={1.7}>
              <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
            </Icon>
            Wishlist
          </button>
        </div>

        {/* Rotina sub-tabs */}
        {isRotina && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '5px',
              margin: '0 0 26px',
              background: 'color-mix(in srgb, var(--color-text) 6%, transparent)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {ROTINA_TABS.map((t) => (
              <button key={t.key} className="cmp-tab" onClick={() => app.setTab(t.key)} style={tabBtnStyle(app.tab === t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {isRotina && app.tab === 'hoje' && <Hoje app={app} />}
        {isRotina && app.tab === 'semana' && <Semana app={app} />}
        {isRotina && app.tab === 'estoque' && <Estoque app={app} />}
        {app.section === 'wishlist' && <Wishlist app={app} />}
      </div>

      <SettingsDialog app={app} />
      <AddDialog app={app} />
      <CatDialog app={app} />
      <Toast message={app.toast} />
    </div>
  )
}
