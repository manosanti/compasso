import type { Compasso } from '../hooks/useCompasso'
import { Icon } from './Icon'

export function Login({ app }: { app: Compasso }) {
  const isSignup = app.authMode === 'signup'
  const authTitle = isSignup ? 'Criar conta' : 'Entrar'
  const authSub = isSignup ? 'Comece a organizar sua rotina hoje.' : 'Que bom te ver de novo.'
  const authSwitchText = isSignup ? 'Já tem conta?' : 'Ainda não tem conta?'
  const authSwitchLink = isSignup ? 'Entrar' : 'Criar agora'

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr' }}>
      {/* Hero panel */}
      <div
        style={{
          padding: '52px 58px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(150deg, color-mix(in srgb, var(--color-accent) 12%, var(--color-bg)), var(--color-bg))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'var(--color-accent)',
              borderRadius: '14px',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              boxShadow: '0 6px 16px color-mix(in srgb, var(--color-accent) 40%, transparent)',
            }}
          >
            <Icon size={24} strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 12l4-2" />
              <path d="M12 12l-2 4" />
            </Icon>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '23px', letterSpacing: '-0.02em' }}>
            Compasso
          </span>
        </div>

        <div style={{ maxWidth: '460px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'var(--color-accent-strong)',
              background: 'var(--color-accent-weak)',
              padding: '6px 12px',
              borderRadius: '999px',
              marginBottom: '22px',
            }}
          >
            Sua vida no compasso certo
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
            Faça o dia render
            <br />
            sem <span style={{ color: 'var(--color-accent)' }}>perder o passo.</span>
          </h1>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              maxWidth: '420px',
              color: 'color-mix(in srgb, var(--color-text) 68%, transparent)',
            }}
          >
            Rotina, estoque do que você não pode deixar acabar e uma lista de desejos que acompanha o preço por você. Tudo
            num lugar só — organizado e sem bagunça.
          </p>
        </div>

        <p style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 45%, transparent)' }}>
          © 2026 Compasso — protótipo
        </p>
      </div>

      {/* Form panel */}
      <div style={{ display: 'grid', placeItems: 'center', padding: '40px', background: 'var(--color-surface)' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            app.login()
          }}
          style={{ width: 'min(380px, 100%)', animation: 'cmpFade .3s ease' }}
        >
          <h3 style={{ fontSize: '29px', fontWeight: 800, marginBottom: '6px' }}>{authTitle}</h3>
          <p style={{ fontSize: '14px', color: 'color-mix(in srgb, var(--color-text) 58%, transparent)', margin: '0 0 28px' }}>
            {authSub}
          </p>

          {isSignup && (
            <div className="field" style={{ marginBottom: '16px' }}>
              <label>Nome</label>
              <input
                className="input"
                type="text"
                value={app.form.name}
                onChange={(e) => app.setForm({ name: e.target.value })}
                placeholder="Como te chamamos?"
              />
            </div>
          )}
          <div className="field" style={{ marginBottom: '16px' }}>
            <label>E-mail</label>
            <input
              className="input"
              type="email"
              value={app.form.email}
              onChange={(e) => app.setForm({ email: e.target.value })}
              placeholder="voce@email.com"
            />
          </div>
          <div className="field" style={{ marginBottom: '24px' }}>
            <label>Senha</label>
            <input
              className="input"
              type="password"
              value={app.form.pass}
              onChange={(e) => app.setForm({ pass: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ height: '46px', fontSize: '15px' }}>
            {authTitle}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-divider)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'color-mix(in srgb, var(--color-text) 42%, transparent)' }}>
              ou
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-divider)' }} />
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => app.login()}>
              Continuar com Google
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => app.login()}>
              Continuar com Apple
            </button>
          </div>

          <p
            style={{
              textAlign: 'center',
              margin: '26px 0 0',
              fontSize: '13px',
              color: 'color-mix(in srgb, var(--color-text) 58%, transparent)',
            }}
          >
            {authSwitchText}{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                app.setAuthMode(isSignup ? 'login' : 'signup')
              }}
              style={{ cursor: 'pointer', fontWeight: 700 }}
            >
              {authSwitchLink}
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
