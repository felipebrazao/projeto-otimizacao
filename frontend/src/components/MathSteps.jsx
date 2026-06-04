export default function MathSteps({ resultado }) {
  if (!resultado) return null;
  return (
    <section className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Como foi obtido</h2>
      <p className="text-sm text-slate-600">
        Toda a derivação foi feita simbolicamente no backend com SymPy.
      </p>
      <ol className="space-y-2 text-sm text-slate-800">
        {resultado.passos.map((p, i) => (
          <li
            key={i}
            className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-[13px] leading-relaxed"
          >
            {p}
          </li>
        ))}
      </ol>
      <details className="text-sm text-slate-700">
        <summary className="cursor-pointer font-medium">Função em LaTeX</summary>
        <pre className="mt-2 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-200">
          L(x, y) = {resultado.funcao_latex}
        </pre>
      </details>
    </section>
  );
}
