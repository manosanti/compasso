import type { Compasso } from '../hooks/useCompasso'

export function AddDialog({ app }: { app: Compasso }) {
  const d = app.dialog
  if (!d) return null

  return (
    <div className="dialog-backdrop" onClick={() => app.setDialog(null)}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <span className="dialog-title">{d.title}</span>
        <div className="field">
          <label>{d.l1}</label>
          <input className="input" value={d.v1} onChange={(e) => app.patchDialog({ v1: e.target.value })} placeholder={d.p1} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="field" style={{ flex: 1 }}>
            <label>{d.l2}</label>
            <input className="input" value={d.v2} onChange={(e) => app.patchDialog({ v2: e.target.value })} placeholder={d.p2} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>{d.l3}</label>
            <input className="input" value={d.v3} onChange={(e) => app.patchDialog({ v3: e.target.value })} placeholder={d.p3} />
          </div>
        </div>
        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={() => app.setDialog(null)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={() => app.saveDialog()}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
