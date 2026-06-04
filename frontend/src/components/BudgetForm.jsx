import { useState } from 'react';

const CAMPOS = [
  { id: 'a1', rotulo: 'a₁ (retorno marginal — Canal A)', defaultValue: 10 },
  { id: 'b1', rotulo: 'b₁ (retorno decrescente — Canal A)', defaultValue: 0.5 },
  { id: 'a2', rotulo: 'a₂ (retorno marginal — Canal B)', defaultValue: 8 },
  { id: 'b2', rotulo: 'b₂ (retorno decrescente — Canal B)', defaultValue: 0.4 },
];

export default function BudgetForm({ onSubmit, carregando }) {
  const [valores, setValores] = useState(
    Object.fromEntries(CAMPOS.map((c) => [c.id, c.defaultValue]))
  );

  function atualizar(id, v) {
    setValores((prev) => ({ ...prev, [id]: v }));
  }

  function submeter(e) {
    e.preventDefault();
    onSubmit({
      a1: Number(valores.a1),
      b1: Number(valores.b1),
      a2: Number(valores.a2),
      b2: Number(valores.b2),
    });
  }

  return (
    <form
      onSubmit={submeter}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <h2 className="text-lg font-semibold text-slate-900">Parâmetros do modelo</h2>
      <p className="text-sm text-slate-600">
        L(x, y) = (a₁·x − b₁·x²) + (a₂·y − b₂·y²) − (x + y)
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CAMPOS.map((c) => (
          <label key={c.id} className="block">
            <span className="text-sm font-medium text-slate-700">{c.rotulo}</span>
            <input
              type="number"
              step="any"
              value={valores[c.id]}
              onChange={(e) => atualizar(c.id, e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              required
            />
            <span className="mt-1 block text-xs text-slate-500">
              {c.id.startsWith('a') ? 'precisa ser > 1' : 'precisa ser > 0'}
            </span>
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={carregando}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {carregando ? 'Calculando…' : 'Calcular alocação ótima'}
      </button>
    </form>
  );
}
