import type { Compasso } from '../hooks/useCompasso'

export function CatDialog({ app }: { app: Compasso }) {
  const d = app.catDialog
  if (!d) return null

  return (
    <div className="dialog-backdrop" onClick={() => app.setCatDialog(null)}>
      <div className="dialog" onClick={(e) => e.stopPropagation()} style={{ width: 'min(400px, 100%)' }}>
        <span className="dialog-title">Nova categoria</span>
        <div className="field">
          <label>Nome</label>
          <input
            className="input"
            value={d.name}
            onChange={(e) => app.patchCatDialog({ name: e.target.value })}
            placeholder="Ex: Carro, Moto, Casa..."
          />
        </div>
        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={() => app.setCatDialog(null)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={() => app.saveCat()}>
            Criar
          </button>
        </div>
      </div>
    </div>
  )
}
