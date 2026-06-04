# Modelo matemático — Otimização de orçamento de marketing

## 1. Contexto

Uma empresa possui um orçamento que pode ser dividido entre dois canais
de marketing **A** e **B** (ex.: Google Ads e Instagram Ads). Sabemos,
empiricamente, que cada canal apresenta **retorno decrescente**: cada
real adicional investido gera, em média, **menos receita** que o real
anterior. Esse fenômeno é chamado, em economia, de *lei dos rendimentos
marginais decrescentes*.

## 2. Variáveis e parâmetros

| Símbolo | Significado | Domínio |
|---------|-------------|---------|
| `x`   | Investimento no canal A | `x ≥ 0` |
| `y`   | Investimento no canal B | `y ≥ 0` |
| `a₁`  | Retorno marginal inicial do canal A | `a₁ > 1` |
| `b₁`  | Coeficiente de saturação do canal A | `b₁ > 0` |
| `a₂`  | Retorno marginal inicial do canal B | `a₂ > 1` |
| `b₂`  | Coeficiente de saturação do canal B | `b₂ > 0` |

A condição `aᵢ > 1` garante que cada canal, no início, cobre o custo
unitário do próprio investimento (caso contrário a alocação ótima seria
`0`). A condição `bᵢ > 0` garante a **concavidade** da função receita.

## 3. Função objetivo

Receita do canal *i*:

$$R_i(t) = a_i t - b_i t^2$$

A derivada `R'ᵢ(t) = aᵢ − 2 bᵢ t` decresce com `t` (retorno marginal
decrescente) e fica negativa para `t > aᵢ/(2 bᵢ)` (canal saturado).

**Lucro total** = receita total − custo (1 R\$ investido = 1 R\$ de custo):

$$
L(x, y) = (a_1 x - b_1 x^2) + (a_2 y - b_2 y^2) - (x + y)
$$

## 4. Gradiente

$$
\nabla L(x, y) =
\begin{pmatrix}
\partial L / \partial x \\
\partial L / \partial y
\end{pmatrix}
=
\begin{pmatrix}
a_1 - 2 b_1 x - 1 \\
a_2 - 2 b_2 y - 1
\end{pmatrix}
$$

## 5. Ponto crítico

Impondo `∇L = 0`:

$$
a_1 - 2 b_1 x - 1 = 0 \;\Rightarrow\; x^{*} = \frac{a_1 - 1}{2 b_1}
$$

$$
a_2 - 2 b_2 y - 1 = 0 \;\Rightarrow\; y^{*} = \frac{a_2 - 1}{2 b_2}
$$

Como `aᵢ > 1` e `bᵢ > 0`, temos `x*, y* > 0` (alocação economicamente
plausível — não investe valor negativo).

## 6. Hessiana e classificação

$$
H = \begin{pmatrix}
\partial^2 L / \partial x^2 & \partial^2 L / \partial x \partial y \\
\partial^2 L / \partial y \partial x & \partial^2 L / \partial y^2
\end{pmatrix}
=
\begin{pmatrix} -2 b_1 & 0 \\ 0 & -2 b_2 \end{pmatrix}
$$

Os **autovalores** de `H` são `λ₁ = −2 b₁` e `λ₂ = −2 b₂`. Como
`bᵢ > 0`, ambos os autovalores são **estritamente negativos** ⇒ `H` é
**negativa definida** em todo ponto do plano ⇒ `L` é **estritamente
côncava** ⇒ o único ponto crítico `(x*, y*)` é um **máximo global**.

> Isso é o que torna o modelo "blindado" matematicamente: não há
> múltiplos máximos locais, não há fronteira a checar (o máximo é
> interior), e a Hessiana não depende de `x, y` (classificação na
> hora).

## 7. Valor ótimo do lucro

Substituindo:

$$
L(x^{*}, y^{*}) = \frac{(a_1 - 1)^2}{4 b_1} + \frac{(a_2 - 1)^2}{4 b_2}
$$

Note como o lucro ótimo **cresce com `aᵢ`** (canal mais "produtivo")
e **decresce com `bᵢ`** (canal que satura mais rápido).

## 8. Análise de sensibilidade

Derivando o lucro ótimo:

$$
\frac{\partial L^{*}}{\partial a_1} = \frac{a_1 - 1}{2 b_1} = x^{*}
\qquad
\frac{\partial L^{*}}{\partial b_1} = -\frac{(a_1 - 1)^2}{4 b_1^2}
$$

A primeira igualdade é o **Teorema do Envelope**: um aumento marginal
em `a₁` aumenta o lucro ótimo na proporção do investimento ótimo
naquele canal.

## 9. Exemplo numérico

Com `a₁ = 10, b₁ = 0,5, a₂ = 8, b₂ = 0,4`:

- `x* = (10 − 1) / (2·0,5) = 9,00` (mil R$)
- `y* = (8 − 1) / (2·0,4) = 8,75` (mil R$)
- `L(x*, y*) = 9²/2 + 7²/1,6 = 40,5 + 30,625 = 71,125`

Portanto a persona deveria investir **R\$ 9.000 no canal A** e
**R\$ 8.750 no canal B**, gerando lucro líquido de aproximadamente
**R\$ 71.125**.
