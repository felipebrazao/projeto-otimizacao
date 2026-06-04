function formatarBRL(v) {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
}

export default function ResultPanel({ resultado }) {
  if (!resultado) return null;

  const cards = [
    { titulo: 'Investir no Canal A (x*)', valor: formatarBRL(resultado.x_otimo), cor: 'bg-indigo-50 text-indigo-700' },
    { titulo: 'Investir no Canal B (y*)', valor: formatarBRL(resultado.y_otimo), cor: 'bg-emerald-50 text-emerald-700' },
    { titulo: 'Lucro ótimo', valor: formatarBRL(resultado.lucro_otimo), cor: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <header className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recomendação</h2>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          {resultado.classificacao}
        </span>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.titulo} className={`rounded-xl p-4 ${c.cor}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-80">{c.titulo}</p>
            <p className="mt-1 text-2xl font-bold">{c.valor}</p>
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm text-slate-700">
        <div>
          <dt className="font-medium">Receita ótima</dt>
          <dd>{formatarBRL(resultado.receita_otima)}</dd>
        </div>
        <div>
          <dt className="font-medium">Custo total</dt>
          <dd>{formatarBRL(resultado.custo_otimo)}</dd>
        </div>
        <div>
          <dt className="font-medium">Autovalores da Hessiana</dt>
          <dd>
            λ₁ = {resultado.autovalores[0].toFixed(4)}; λ₂ = {resultado.autovalores[1].toFixed(4)}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Hessiana</dt>
          <dd className="font-mono text-xs">
            [[{resultado.hessiana[0][0]}, {resultado.hessiana[0][1]}],
            [{resultado.hessiana[1][0]}, {resultado.hessiana[1][1]}]]
          </dd>
        </div>
      </dl>
    </section>
  );
}
