import { useState } from 'react';
import BudgetForm from './components/BudgetForm.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import MathSteps from './components/MathSteps.jsx';
import Surface3D from './components/Surface3D.jsx';
import { otimizar, superficie } from './api.js';

export default function App() {
  const [resultado, setResultado] = useState(null);
  const [malha, setMalha] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function calcular(params) {
    setCarregando(true);
    setErro(null);
    try {
      const [r, s] = await Promise.all([otimizar(params), superficie(params)]);
      setResultado(r);
      setMalha(s);
    } catch (e) {
      setErro(e.message);
      setResultado(null);
      setMalha(null);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Otimização de Orçamento de Marketing
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Divida um orçamento entre dois canais (ex.: Google Ads e Instagram) considerando o retorno
          decrescente de cada um. O sistema deriva, resolve e classifica o ponto crítico
          simbolicamente, e mostra a superfície 3D do lucro com o ótimo destacado.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BudgetForm onSubmit={calcular} carregando={carregando} />
        <ResultPanel resultado={resultado} />
      </div>

      {erro && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {malha && (
        <div className="mt-6">
          <Surface3D superficie={malha} />
        </div>
      )}

      {resultado && (
        <div className="mt-6">
          <MathSteps resultado={resultado} />
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-slate-500">
        Projeto PBL · Cálculo de Várias Variáveis · FastAPI + SymPy + React + Plotly
      </footer>
    </div>
  );
}
