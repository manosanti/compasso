import { Icon } from './Icon'

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--color-neutral-900)',
        color: 'var(--color-neutral-100)',
        padding: '13px 22px',
        borderRadius: '999px',
        fontSize: '14px',
        fontWeight: 600,
        boxShadow: 'var(--shadow-lg)',
        animation: 'cmpToast .25s ease',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
      }}
    >
      <Icon size={16} stroke="var(--color-accent)" strokeWidth={2.4}>
        <path d="M20 6L9 17l-5-5" />
      </Icon>
      {message}
    </div>
  )
}
