# Otimização de Alocação de Orçamento de Marketing

Projeto PBL — 2º Bimestre (Cálculo de Várias Variáveis).

Uma empresa precisa dividir um orçamento entre dois canais de marketing
(ex.: **Google Ads** e **Instagram Ads**). Cada canal tem **retorno
decrescente** (lei dos rendimentos marginais decrescentes). O sistema
calcula simbolicamente quanto investir em cada canal para **maximizar
o lucro**, exibindo todos os passos matemáticos (gradiente, ponto
crítico, Hessiana, classificação) e a superfície 3D do lucro.

## 🧮 Modelo matemático

Função lucro (forma quadrática côncava):

$$
L(x,y) \;=\; (a_1 x - b_1 x^2) + (a_2 y - b_2 y^2) - (x + y)
$$

- `x`, `y` ≥ 0 são os investimentos em cada canal.
- `aᵢ x − bᵢ x²` é a receita do canal *i* com retorno decrescente.
- `(x + y)` é o custo do investimento.

**Gradiente:**

$$
\nabla L = \begin{pmatrix} a_1 - 2 b_1 x - 1 \\ a_2 - 2 b_2 y - 1 \end{pmatrix}
$$

**Ponto crítico** (∇L = 0):

$$
x^* = \frac{a_1 - 1}{2 b_1}, \qquad y^* = \frac{a_2 - 1}{2 b_2}
$$

**Hessiana:**

$$
H = \begin{pmatrix} -2 b_1 & 0 \\ 0 & -2 b_2 \end{pmatrix}
$$

Como `b₁, b₂ > 0`, os autovalores são negativos → H é **negativa
definida** → o ponto crítico é um **máximo global**.

Detalhes adicionais em [docs/modelo-matematico.md](docs/modelo-matematico.md).

## 🏗️ Arquitetura

```
[React form: a₁,b₁,a₂,b₂]
        │  POST /otimizar
        ▼
[FastAPI + SymPy]
   ├─ deriva ∂L/∂x, ∂L/∂y
   ├─ resolve ∇L = 0
   ├─ monta a Hessiana
   └─ classifica via autovalores
        │
        ▼
{ x*, y*, L*, passos, classificação }
        │
        ▼
[React: recomendação + gráfico 3D + "Como foi obtido"]
```

## 📁 Estrutura de pastas

```
projeto-otimização/
├── backend/                FastAPI + SymPy + NumPy
│   ├── app/
│   │   ├── main.py         endpoints HTTP
│   │   ├── optimizer.py    núcleo simbólico (SymPy)
│   │   └── schemas.py      validação Pydantic
│   ├── tests/              pytest
│   └── requirements.txt
├── frontend/               React (Vite) + Tailwind + Plotly
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
├── docs/
│   └── modelo-matematico.md
└── README.md
```

## ▶️ Como executar

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API disponível em <http://localhost:8000>. Documentação interativa
(Swagger) em <http://localhost:8000/docs>.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

App disponível em <http://localhost:5173>.

### Testes

```powershell
cd backend
pytest -v
```

## 🧪 Exemplo de chamada

```bash
curl -X POST http://localhost:8000/otimizar ^
  -H "Content-Type: application/json" ^
  -d "{\"a1\":10,\"b1\":0.5,\"a2\":8,\"b2\":0.4}"
```

Resposta resumida:

```json
{
  "x_otimo": 9.0,
  "y_otimo": 8.75,
  "lucro_otimo": 71.125,
  "classificacao": "máximo global",
  "hessiana": [[-1.0, 0.0], [0.0, -0.8]],
  "autovalores": [-1.0, -0.8],
  "passos": ["L(x,y) = ...", "∂L/∂x = ...", "..."]
}
```

## 📚 Prospecção (artigo científico)

Problema baseado em artigo revisado por pares:

> Yang, Y., Feng, B., Salminen, J., & Jansen, B. J. (2022). *Optimal
> advertising for a generalized Vidale–Wolfe response model.* **Electronic
> Commerce Research**, 22(4), 1275–1305.
> DOI: [10.1007/s10660-021-09468-x](https://doi.org/10.1007/s10660-021-09468-x).

O artigo demonstra empiricamente, com dados reais de Google AdWords, Facebook
Ads e Baidu Ads, que o retorno do investimento em mídia segue a **lei dos
rendimentos marginais decrescentes** — a hipótese central do nosso modelo.
Recorte, citação e justificativa completos em
[docs/prospeccao.md](docs/prospeccao.md).

## 👥 Persona

**Rafaela Mendes**, 31, analista de marketing digital de um e-commerce de
moda. Divide um orçamento mensal de R$ 40 mil entre **Google Ads** e
**Instagram Ads** decidindo "no feeling" — e desperdiça verba no canal já
saturado. Já estima do histórico que a receita do Google é aprox. `10x − 0,5x²`
e a do Instagram `8y − 0,4y²` (com `x`, `y` em milhares de R$). Quer saber
**quanto investir em cada canal**, **por que** é a alocação ótima e ter a
justificativa matemática para defender na diretoria.

Persona completa (biografia, dor, métricas de sucesso e impacto esperado) em
[docs/persona.md](docs/persona.md).

## ✅ Critérios PBL atendidos

- **Função de várias variáveis** real (lucro = receita − custo).
- **Retorno decrescente** justificado (concavidade).
- **Gradiente, ponto crítico e Hessiana** calculados simbolicamente.
- **Classificação** rigorosa via autovalores.
- **Visualização 3D** da superfície com o ponto ótimo destacado.
- **Front + back separados** (FastAPI + React).

## 📄 Relatório e apresentação

O relatório completo (5–10 páginas) está em
[relatorio/relatorio.pdf](relatorio/relatorio.pdf) e os slides em
[relatorio/apresentacao.pptx](relatorio/apresentacao.pptx). Ambos são
**gerados programaticamente** e podem ser reproduzidos:

```powershell
# Relatório PDF (Python + reportlab, já em requirements.txt)
cd backend
.\.venv\Scripts\Activate.ps1
python ..\relatorio\gerar_relatorio.py

# Slides PPTX (Node + pptxgenjs)
cd ..\relatorio
npm install
node gerar_slides.js
```

## 🤖 Declaração de uso de IA

Conforme exigido pela disciplina, declaramos o uso de ferramentas de IA neste
projeto. Assistentes de IA (Claude) foram usados como **apoio** para:

- redação e revisão de texto da documentação (README, relatório, persona);
- *scaffolding* inicial do código (estrutura FastAPI/React) e dos testes;
- localização e formatação da referência bibliográfica.

A **modelagem matemática** (função objetivo, gradiente, Hessiana, classificação)
foi conferida manualmente pela equipe, e os resultados numéricos são validados
pelos testes automatizados em `backend/tests/`. Nenhum conteúdo foi entregue sem
revisão humana.

## 📜 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE).

## 👨‍💻 Equipe

Equipe de até 3 integrantes:

- Felipe Brazão
- Gabriel Goes
- Felipe Liborio
