/*
 * Gera a apresentação do projeto (apresentacao.pptx).
 * Reprodutível:  cd relatorio && npm install && node gerar_slides.js
 *
 * Paleta executiva indigo/navy (combina com o app). Fontes: Cambria nos
 * títulos/equações (cobre ∂, ∇, λ, subscritos) e Calibri no corpo.
 */
const pptx = require("pptxgenjs");

const p = new pptx();
p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
p.author = "Felipe Brazão, Gabriel Goes, Felipe Liborio";
p.title = "Otimização de Orçamento de Marketing";

// ---- Paleta -------------------------------------------------------------
const NAVY = "1E2761", INDIGO = "4F46E5", ICE = "EEF2FF";
const AMBER = "F59E0B", EMERALD = "10B981", INK = "0F172A";
const MUTED = "64748B", WHITE = "FFFFFF", LINE = "CBD5E1";
const SERIF = "Cambria", SANS = "Calibri";
const W = 13.33, H = 7.5, M = 0.7;

const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.12 });

// ---- Helpers ------------------------------------------------------------
function kicker(slide, text, color = INDIGO) {
  slide.addText(text.toUpperCase(), {
    x: M, y: 0.5, w: W - 2 * M, h: 0.3, fontFace: SANS, fontSize: 12,
    bold: true, color, charSpacing: 3, margin: 0,
  });
}
function title(slide, text, color = INK) {
  slide.addText(text, {
    x: M, y: 0.8, w: W - 2 * M, h: 0.85, fontFace: SERIF, fontSize: 32,
    bold: true, color, margin: 0,
  });
}
function card(slide, x, y, w, h, fill = WHITE) {
  slide.addShape(p.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, fill: { color: fill }, rectRadius: 0.08, shadow: shadow(),
  });
}
function numberBadge(slide, x, y, n, bg = INDIGO) {
  slide.addShape(p.shapes.OVAL, { x, y, w: 0.5, h: 0.5, fill: { color: bg } });
  slide.addText(String(n), { x, y, w: 0.5, h: 0.5, align: "center", valign: "middle",
    fontFace: SERIF, fontSize: 18, bold: true, color: WHITE, margin: 0 });
}
function eqBox(slide, x, y, w, h, eq, size = 22, fill = ICE, txtColor = INK) {
  card(slide, x, y, w, h, fill);
  slide.addText(eq, { x: x + 0.15, y, w: w - 0.3, h, align: "center", valign: "middle",
    fontFace: SERIF, fontSize: size, color: txtColor, margin: 0 });
}

// ========================================================================
// 1. CAPA
// ========================================================================
let s = p.addSlide();
s.background = { color: NAVY };
s.addText("CENTRO UNIVERSITÁRIO DO PARÁ · CIÊNCIA DA COMPUTAÇÃO", {
  x: M, y: 0.9, w: W - 2 * M, h: 0.3, fontFace: SANS, fontSize: 12, bold: true,
  color: "A5B4FC", charSpacing: 2, margin: 0,
});
s.addText("Resolução de Problemas Multivariáveis · Prof. Pedro Girotto", {
  x: M, y: 1.2, w: W - 2 * M, h: 0.3, fontFace: SANS, fontSize: 12, color: "CADCFC", margin: 0,
});
s.addText("Otimização da Alocação de\nOrçamento de Marketing", {
  x: M, y: 2.2, w: W - 2 * M, h: 1.9, fontFace: SERIF, fontSize: 50, bold: true,
  color: WHITE, lineSpacingMultiple: 1.0, margin: 0,
});
s.addText("Maximizar o lucro entre dois canais de mídia com retorno marginal decrescente — via gradiente e critério da Hessiana.", {
  x: M, y: 4.25, w: 9.8, h: 0.8, fontFace: SANS, fontSize: 18, color: "CADCFC", margin: 0,
});
s.addShape(p.shapes.LINE, { x: M, y: 5.55, w: 3.2, h: 0, line: { color: AMBER, width: 2.5 } });
s.addText([
  { text: "Equipe   ", options: { bold: true, color: AMBER } },
  { text: "Felipe Brazão  ·  Gabriel Goes  ·  Felipe Liborio", options: { color: WHITE } },
], { x: M, y: 5.8, w: W - 2 * M, h: 0.35, fontFace: SANS, fontSize: 15, margin: 0 });
s.addText("Aplicação full stack: FastAPI + SymPy + React  ·  Belém, junho de 2026", {
  x: M, y: 6.2, w: W - 2 * M, h: 0.3, fontFace: SANS, fontSize: 12, color: "94A3B8", margin: 0,
});
s.addNotes("Abertura: apresentar o tema — usar cálculo de várias variáveis para resolver um problema real de marketing, com sistema full stack ao final.");

// ========================================================================
// 2. PROSPECÇÃO / PROBLEMA
// ========================================================================
s = p.addSlide();
kicker(s, "1 · Prospecção do Problema (PBL)");
title(s, "Um problema real: onde investir a verba?");
// esquerda: texto + referência
s.addText("Empresas dividem a verba entre canais de mídia (Google, Instagram). Cada canal tem retorno marginal decrescente: cada real a mais rende menos que o anterior, até saturar.", {
  x: M, y: 1.9, w: 6.0, h: 1.3, fontFace: SANS, fontSize: 16, color: INK, lineSpacingMultiple: 1.1, margin: 0,
});
card(s, M, 3.3, 6.0, 2.9, ICE);
s.addText("ARTIGO DE REFERÊNCIA", { x: M + 0.3, y: 3.5, w: 5.4, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, color: INDIGO, charSpacing: 2, margin: 0 });
s.addText([
  { text: "Yang, Y., Feng, B., Salminen, J. & Jansen, B. J. (2022). ", options: { bold: true } },
  { text: "Optimal advertising for a generalized Vidale–Wolfe response model. ", options: { italic: true } },
  { text: "Electronic Commerce Research, 22(4), 1275–1305. DOI: 10.1007/s10660-021-09468-x.", options: {} },
], { x: M + 0.3, y: 3.85, w: 5.4, h: 1.3, fontFace: SANS, fontSize: 13.5, color: INK, lineSpacingMultiple: 1.08, margin: 0 });
s.addText("“…the ROI decreases, which is consistent with the law of diminishing marginal utility.”", {
  x: M + 0.3, y: 5.25, w: 5.4, h: 0.8, fontFace: SERIF, italic: true, fontSize: 13, color: MUTED, margin: 0,
});
// direita: curva côncava (retorno decrescente)
const ts = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
const rev = ts.map((t) => +(10 * t - 0.5 * t * t).toFixed(1));
s.addText("Receita de um canal: retorno decrescente", { x: 7.2, y: 1.85, w: 5.4, h: 0.35, fontFace: SANS, fontSize: 13, bold: true, color: INK, align: "center", margin: 0 });
s.addChart(p.charts.LINE, [{ name: "Receita", labels: ts.map(String), values: rev }], {
  x: 7.1, y: 2.25, w: 5.5, h: 3.9, lineSize: 3, lineSmooth: true, chartColors: [INDIGO],
  showLegend: false, showTitle: false, chartArea: { fill: { color: WHITE } },
  catAxisTitle: "Investimento no canal", showCatAxisTitle: true, catAxisTitleColor: MUTED, catAxisTitleFontSize: 11,
  valAxisTitle: "Receita", showValAxisTitle: true, valAxisTitleColor: MUTED, valAxisTitleFontSize: 11,
  catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, catAxisLabelFontSize: 9, valAxisLabelFontSize: 9,
  valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
});
s.addNotes("Explicar diminishing returns: a curva é arqueada para baixo (côncava). Citar o artigo real (Springer, dados de Google/Facebook/Baidu). Essa concavidade é o que garante um ponto ótimo.");

// ========================================================================
// 3. PERSONA
// ========================================================================
s = p.addSlide();
kicker(s, "2 · Persona e Contexto");
title(s, "Rafaela precisa decidir — e justificar");
// card persona
card(s, M, 1.95, 5.3, 4.4, NAVY);
s.addShape(p.shapes.OVAL, { x: M + 0.35, y: 2.3, w: 1.1, h: 1.1, fill: { color: INDIGO } });
s.addText("RM", { x: M + 0.35, y: 2.3, w: 1.1, h: 1.1, align: "center", valign: "middle", fontFace: SERIF, fontSize: 30, bold: true, color: WHITE, margin: 0 });
s.addText("Rafaela Mendes, 31", { x: M + 1.65, y: 2.45, w: 3.4, h: 0.4, fontFace: SERIF, fontSize: 21, bold: true, color: WHITE, margin: 0 });
s.addText("Analista de Marketing Digital · e-commerce de moda", { x: M + 1.65, y: 2.9, w: 3.4, h: 0.5, fontFace: SANS, fontSize: 13, color: "CADCFC", margin: 0 });
s.addText([
  { text: "Administra ", options: {} },
  { text: "R$ 40 mil/mês", options: { bold: true, color: AMBER } },
  { text: " de mídia paga entre ", options: {} },
  { text: "Google Ads", options: { bold: true, color: WHITE } },
  { text: " e ", options: {} },
  { text: "Instagram Ads", options: { bold: true, color: WHITE } },
  { text: ". Lê planilhas, mas não tem formação em cálculo.", options: {} },
], { x: M + 0.35, y: 3.7, w: 4.7, h: 1.4, fontFace: SANS, fontSize: 14, color: "E2E8F0", lineSpacingMultiple: 1.12, margin: 0 });
// dor
s.addText("A DOR", { x: 6.5, y: 2.0, w: 6, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color: AMBER, charSpacing: 2, margin: 0 });
const dor = [
  "Decide a divisão da verba “no feeling”, por tentativa e erro.",
  "Investe demais no canal já saturado e de menos no que ainda renderia — desperdiça verba.",
  "Não consegue justificar a alocação para a diretoria com números, só com intuição.",
  "Refaz a análise manualmente todo mês (~4 horas).",
];
s.addText(dor.map((t, i) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 10 } })), {
  x: 6.5, y: 2.45, w: 6.1, h: 3.8, fontFace: SANS, fontSize: 16, color: INK, lineSpacingMultiple: 1.05, margin: 0,
});
s.addNotes("Apresentar a persona como cliente real. A dor central: decisão sem critério, verba desperdiçada e falta de justificativa para a diretoria.");

// ========================================================================
// 4. MÉTRICAS DE SUCESSO
// ========================================================================
s = p.addSlide();
kicker(s, "2 · Persona e Contexto");
title(s, "Métricas de sucesso");
const stats = [
  { big: "+10–15%", lab: "no lucro líquido da mídia paga", c: EMERALD },
  { big: "< 5%", lab: "de verba desperdiçada (era 15–20%)", c: INDIGO },
  { big: "< 5 min", lab: "para decidir a alocação (eram ~4 h)", c: AMBER },
  { big: "100%", lab: "das decisões com justificativa à diretoria", c: NAVY },
];
const cw = (W - 2 * M - 3 * 0.4) / 4;
stats.forEach((st, i) => {
  const x = M + i * (cw + 0.4);
  card(s, x, 2.2, cw, 3.0);
  s.addText(st.big, { x: x + 0.1, y: 2.8, w: cw - 0.2, h: 0.95, align: "center", valign: "middle", fontFace: SERIF, fontSize: 33, bold: true, color: st.c, margin: 0 });
  s.addShape(p.shapes.LINE, { x: x + cw / 2 - 0.4, y: 3.85, w: 0.8, h: 0, line: { color: LINE, width: 1.5 } });
  s.addText(st.lab, { x: x + 0.25, y: 4.05, w: cw - 0.5, h: 1.0, align: "center", fontFace: SANS, fontSize: 14, color: MUTED, lineSpacingMultiple: 1.05, margin: 0 });
});
s.addText("Os parâmetros de cada canal Rafaela já obtém do histórico das próprias campanhas — o sistema apenas resolve a otimização.", {
  x: M, y: 5.7, w: W - 2 * M, h: 0.5, align: "center", fontFace: SANS, italic: true, fontSize: 14, color: MUTED, margin: 0,
});
s.addNotes("Métricas mensuráveis: ganho de lucro, redução de desperdício e de tempo, e 100% de decisões justificáveis.");

// ========================================================================
// 5. MODELAGEM 1 — VARIÁVEIS E FUNÇÃO OBJETIVO
// ========================================================================
s = p.addSlide();
kicker(s, "3 · Modelagem Matemática");
title(s, "Variáveis, função objetivo e domínio");
const vars = [
  ["x, y", "investimento em cada canal (mil R$), x, y ≥ 0"],
  ["a₁, a₂", "retorno marginal inicial de cada canal (aᵢ > 1)"],
  ["b₁, b₂", "coeficiente de saturação / concavidade (bᵢ > 0)"],
];
vars.forEach((v, i) => {
  const y = 2.05 + i * 0.95;
  card(s, M, y, 5.9, 0.8, ICE);
  s.addText(v[0], { x: M + 0.25, y, w: 1.4, h: 0.8, valign: "middle", fontFace: SERIF, fontSize: 20, bold: true, color: INDIGO, margin: 0 });
  s.addText(v[1], { x: M + 1.7, y, w: 4.0, h: 0.8, valign: "middle", fontFace: SANS, fontSize: 13.5, color: INK, lineSpacingMultiple: 1.0, margin: 0 });
});
s.addText("Receita de um canal (parábola côncava = retorno decrescente):", { x: 6.9, y: 2.0, w: 5.7, h: 0.4, fontFace: SANS, fontSize: 14, color: INK, margin: 0 });
eqBox(s, 6.9, 2.45, 5.7, 0.9, "Rᵢ(t) = aᵢ·t − bᵢ·t²", 22);
s.addText("Lucro total = receita dos 2 canais − custo (1 R$ investido = 1 R$):", { x: 6.9, y: 3.65, w: 5.7, h: 0.4, fontFace: SANS, fontSize: 14, color: INK, margin: 0 });
eqBox(s, 6.9, 4.1, 5.7, 1.0, "L(x,y) = (a₁x − b₁x²) + (a₂y − b₂y²) − (x + y)", 16, NAVY, WHITE);
s.addText("Domínio:  D = { (x, y) ∈ ℝ² : x ≥ 0, y ≥ 0 }", { x: 6.9, y: 5.35, w: 5.7, h: 0.5, fontFace: SERIF, fontSize: 15, color: MUTED, margin: 0 });
s.addNotes("Definir as variáveis de decisão e a função objetivo. Destacar que a receita é côncava (b>0) e o custo é linear. O domínio é o primeiro quadrante.");

// ========================================================================
// 6. MODELAGEM 2 — GRADIENTE E PONTO CRÍTICO
// ========================================================================
s = p.addSlide();
kicker(s, "3 · Modelagem Matemática");
title(s, "Gradiente e ponto crítico (∇L = 0)");
s.addText("Derivadas parciais", { x: M, y: 1.95, w: 5.8, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: INDIGO, margin: 0 });
eqBox(s, M, 2.4, 5.8, 0.9, "∂L/∂x = a₁ − 2b₁x − 1", 20);
eqBox(s, M, 3.45, 5.8, 0.9, "∂L/∂y = a₂ − 2b₂y − 1", 20);
s.addText("Gradiente", { x: M, y: 4.55, w: 5.8, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: INDIGO, margin: 0 });
eqBox(s, M, 5.0, 5.8, 1.0, "∇L = ( a₁ − 2b₁x − 1 ,  a₂ − 2b₂y − 1 )", 16);
// direita: resolução
card(s, 6.9, 1.95, 5.7, 4.05, NAVY);
s.addText("Resolvendo ∇L = 0", { x: 7.2, y: 2.2, w: 5.1, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: AMBER, margin: 0 });
s.addText("O sistema é desacoplado (cada equação só tem uma variável) → solução única em forma fechada:", {
  x: 7.2, y: 2.6, w: 5.1, h: 0.9, fontFace: SANS, fontSize: 14, color: "E2E8F0", lineSpacingMultiple: 1.1, margin: 0,
});
eqBox(s, 7.2, 3.6, 5.1, 1.0, "x* = (a₁ − 1) / (2b₁)", 22, ICE);
eqBox(s, 7.2, 4.75, 5.1, 1.0, "y* = (a₂ − 1) / (2b₂)", 22, ICE);
s.addNotes("Mostrar o cálculo das parciais, montar o gradiente e resolver ∇L=0. Enfatizar que o sistema é desacoplado, dando solução fechada e única.");

// ========================================================================
// 7. MODELAGEM 3 — HESSIANA E CLASSIFICAÇÃO
// ========================================================================
s = p.addSlide();
kicker(s, "3 · Modelagem Matemática");
title(s, "Hessiana → é um máximo global");
s.addText("Matriz Hessiana (constante, não depende de x, y):", { x: M, y: 1.95, w: 6.0, h: 0.4, fontFace: SANS, fontSize: 15, color: INK, margin: 0 });
eqBox(s, M, 2.45, 6.0, 1.3, "H =  [ −2b₁    0 ]\n       [   0   −2b₂ ]", 20);
s.addText("Autovalores:  λ₁ = −2b₁ ,  λ₂ = −2b₂", { x: M, y: 4.0, w: 6.0, h: 0.5, fontFace: SERIF, fontSize: 18, bold: true, color: INDIGO, margin: 0 });
s.addText([
  { text: "Como bᵢ > 0, ambos os autovalores são estritamente negativos.", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "⇒ H é negativa definida em todo o plano.", options: { breakLine: true, paraSpaceAfter: 6 } },
  { text: "⇒ L é estritamente côncava ⇒ ponto crítico único.", options: {} },
], { x: M, y: 4.6, w: 6.0, h: 1.6, fontFace: SANS, fontSize: 15, color: INK, lineSpacingMultiple: 1.1, margin: 0 });
// destaque conclusão
card(s, 7.1, 2.3, 5.5, 3.4, EMERALD);
s.addText("✓", { x: 7.1, y: 2.7, w: 5.5, h: 0.9, align: "center", fontFace: SANS, fontSize: 44, bold: true, color: WHITE, margin: 0 });
s.addText("MÁXIMO GLOBAL", { x: 7.1, y: 3.75, w: 5.5, h: 0.6, align: "center", fontFace: SERIF, fontSize: 28, bold: true, color: WHITE, margin: 0 });
s.addText("Sem máximos locais concorrentes e sem fronteira a verificar — o ótimo é interior e garantido.", {
  x: 7.4, y: 4.5, w: 4.9, h: 1.0, align: "center", fontFace: SANS, fontSize: 14, color: "ECFDF5", lineSpacingMultiple: 1.1, margin: 0,
});
s.addNotes("Aplicar o critério da Hessiana. Como é diagonal com entradas negativas, os autovalores são negativos → negativa definida → máximo global. Esse é o coração da disciplina.");

// ========================================================================
// 8. EXEMPLO NUMÉRICO
// ========================================================================
s = p.addSlide();
kicker(s, "4 · Resultado");
title(s, "Exemplo: a₁=10, b₁=0,5, a₂=8, b₂=0,4");
s.addText("Alocação ótima recomendada (mil R$)", { x: M, y: 1.95, w: 6.2, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: INK, margin: 0 });
s.addChart(p.charts.BAR, [{ name: "Investimento", labels: ["Canal A (Google)", "Canal B (Instagram)"], values: [9.0, 8.75] }], {
  x: M, y: 2.4, w: 6.2, h: 3.7, barDir: "col", chartColors: [INDIGO],
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontSize: 14, dataLabelFontBold: true,
  showLegend: false, catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, catAxisLabelFontSize: 12, valAxisLabelFontSize: 10,
  valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" }, chartArea: { fill: { color: WHITE } },
  valAxisMaxVal: 12, valAxisMinVal: 0, barGapWidthPct: 60,
});
// stat lucro + interpretação
card(s, 7.1, 2.4, 5.5, 1.8, AMBER);
s.addText("Lucro ótimo  L(x*, y*)", { x: 7.3, y: 2.6, w: 5.1, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: "7C2D12", margin: 0 });
s.addText("≈ R$ 71,1 mil", { x: 7.3, y: 3.0, w: 5.1, h: 1.0, fontFace: SERIF, fontSize: 40, bold: true, color: "7C2D12", margin: 0 });
card(s, 7.1, 4.4, 5.5, 1.7, ICE);
s.addText([
  { text: "Investir ", options: {} },
  { text: "R$ 9.000", options: { bold: true, color: INDIGO } },
  { text: " no canal A e ", options: {} },
  { text: "R$ 8.750", options: { bold: true, color: INDIGO } },
  { text: " no canal B. Autovalores −1,0 e −0,8 (< 0) confirmam o máximo: qualquer desvio reduz o lucro.", options: {} },
], { x: 7.35, y: 4.6, w: 5.0, h: 1.4, fontFace: SANS, fontSize: 14.5, color: INK, lineSpacingMultiple: 1.12, valign: "middle", margin: 0 });
s.addNotes("Mostrar um caso concreto com números. Conectar com a recomendação que o sistema entrega à Rafaela e a garantia matemática (autovalores negativos).");

// ========================================================================
// 9. ARQUITETURA FULL STACK
// ========================================================================
s = p.addSlide();
kicker(s, "5 · Implementação");
title(s, "Arquitetura: do parâmetro à recomendação");
const flow = [
  { t: "Front end", d: "Persona insere a₁, b₁, a₂, b₂", c: INDIGO, sub: "React + Tailwind + Plotly" },
  { t: "Back end", d: "Deriva ∇L, resolve ∇L = 0, classifica via Hessiana", c: NAVY, sub: "FastAPI + SymPy + NumPy" },
  { t: "Recomendação", d: "x*, y*, L*, passos e gráfico 3D", c: EMERALD, sub: "“Como foi obtido”" },
];
const fw = 3.7, gap = ((W - 2 * M) - 3 * fw) / 2;
flow.forEach((f, i) => {
  const x = M + i * (fw + gap);
  card(s, x, 2.5, fw, 2.9);
  s.addShape(p.shapes.OVAL, { x: x + fw / 2 - 0.35, y: 2.8, w: 0.7, h: 0.7, fill: { color: f.c } });
  s.addText(String(i + 1), { x: x + fw / 2 - 0.35, y: 2.8, w: 0.7, h: 0.7, align: "center", valign: "middle", fontFace: SERIF, fontSize: 22, bold: true, color: WHITE, margin: 0 });
  s.addText(f.t, { x: x + 0.2, y: 3.65, w: fw - 0.4, h: 0.5, align: "center", fontFace: SERIF, fontSize: 20, bold: true, color: INK, margin: 0 });
  s.addText(f.d, { x: x + 0.3, y: 4.15, w: fw - 0.6, h: 0.9, align: "center", fontFace: SANS, fontSize: 13.5, color: MUTED, lineSpacingMultiple: 1.05, margin: 0 });
  s.addText(f.sub, { x: x + 0.2, y: 5.0, w: fw - 0.4, h: 0.3, align: "center", fontFace: SANS, fontSize: 11.5, bold: true, color: f.c, margin: 0 });
  if (i < 2) s.addText("→", { x: x + fw + gap / 2 - 0.25, y: 3.55, w: 0.5, h: 0.6, align: "center", valign: "middle", fontFace: SANS, fontSize: 30, bold: true, color: LINE, margin: 0 });
});
s.addText("Validação Pydantic (aᵢ > 1, bᵢ > 0) · 8 testes pytest garantindo a corretude do cálculo.", {
  x: M, y: 5.7, w: W - 2 * M, h: 0.4, align: "center", fontFace: SANS, italic: true, fontSize: 14, color: MUTED, margin: 0,
});
s.addNotes("Mostrar o fluxo: o usuário só insere 4 números; o back end faz toda a matemática simbólica; o front end devolve recomendação + justificativa. Momento de fazer a DEMO ao vivo.");

// ========================================================================
// 10. IMPLEMENTAÇÃO — BACK + FRONT
// ========================================================================
s = p.addSlide();
kicker(s, "5 · Implementação");
title(s, "Back end e Front end");
card(s, M, 2.0, 5.85, 4.3, ICE);
s.addText("BACK END · FastAPI + SymPy", { x: M + 0.35, y: 2.25, w: 5.2, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: INDIGO, charSpacing: 1, margin: 0 });
s.addText([
  "POST /otimizar recebe (a₁, b₁, a₂, b₂).",
  "SymPy deriva ∂L/∂x, ∂L/∂y e resolve ∇L = 0.",
  "Monta a Hessiana e classifica pelos autovalores.",
  "Retorna x*, y*, L*, receita, custo e os passos.",
  "/superficie gera a malha 3D do lucro.",
].map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 8 } })), {
  x: M + 0.35, y: 2.7, w: 5.2, h: 3.4, fontFace: SANS, fontSize: 14, color: INK, lineSpacingMultiple: 1.05, margin: 0,
});
card(s, 6.95, 2.0, 5.65, 4.3);
s.addText("FRONT END · React + Tailwind + Plotly", { x: 7.3, y: 2.25, w: 5.0, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: EMERALD, charSpacing: 1, margin: 0 });
s.addText([
  "Formulário simples: 4 parâmetros, sem matemática.",
  "Recomendação em cartões (R$) + classificação.",
  "Superfície 3D do lucro com o ótimo destacado.",
  "Seção “Como foi obtido” com os passos legíveis.",
  "Pensado para a persona não especialista.",
].map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 8 } })), {
  x: 7.3, y: 2.7, w: 5.0, h: 3.4, fontFace: SANS, fontSize: 14, color: INK, lineSpacingMultiple: 1.05, margin: 0,
});
s.addNotes("Detalhar a separação de responsabilidades. Reforçar que o usuário não precisa saber cálculo — a justificativa matemática vem pronta do back end.");

// ========================================================================
// 11. COMO A SOLUÇÃO FOI OBTIDA (ACESSÍVEL)
// ========================================================================
s = p.addSlide();
s.background = { color: ICE };
kicker(s, "6 · Comunicação ao usuário");
title(s, "“Como a solução foi obtida”");
s.addText([
  { text: "Cada canal rende cada vez menos à medida que recebe mais dinheiro (satura). ", options: { breakLine: true, paraSpaceAfter: 10 } },
  { text: "O ponto ótimo é onde o último real investido em A rende o mesmo que o último em B — daí em diante, mover verba só piora o resultado. ", options: { breakLine: true, paraSpaceAfter: 10 } },
  { text: "Matematicamente, isso ocorre onde as duas inclinações do lucro (as derivadas parciais) são zero ao mesmo tempo. Resolvendo, chegamos a x* e y*. ", options: { breakLine: true, paraSpaceAfter: 10 } },
  { text: "O teste da Hessiana confirma que é um pico (e não um vale): como a curva é “arqueada para baixo” nas duas direções, é o ponto de lucro máximo.", options: {} },
], { x: M, y: 2.1, w: 9.4, h: 4.0, fontFace: SANS, fontSize: 20, color: INK, lineSpacingMultiple: 1.15, margin: 0 });
s.addShape(p.shapes.LINE, { x: M, y: 6.4, w: 2.6, h: 0, line: { color: AMBER, width: 2.5 } });
s.addText("Linguagem acessível — sem exigir cálculo do usuário.", { x: M, y: 6.55, w: 8, h: 0.4, fontFace: SANS, italic: true, fontSize: 14, color: MUTED, margin: 0 });
s.addNotes("Mostrar como o sistema traduz a matemática para o usuário leigo — atende explicitamente ao requisito da seção 'Como a solução foi obtida'.");

// ========================================================================
// 12. CONCLUSÃO
// ========================================================================
s = p.addSlide();
s.background = { color: NAVY };
s.addText("CONCLUSÃO", { x: M, y: 0.85, w: W - 2 * M, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color: AMBER, charSpacing: 3, margin: 0 });
s.addText("Da teoria ao produto", { x: M, y: 1.2, w: W - 2 * M, h: 0.9, fontFace: SERIF, fontSize: 34, bold: true, color: WHITE, margin: 0 });
s.addText([
  "Problema real (artigo Springer) modelado como L(x, y) de duas variáveis.",
  "Gradiente, ponto crítico e Hessiana resolvidos analiticamente → máximo global.",
  "Sistema full stack que entrega a recomendação e a justificativa à persona.",
].map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 12, color: "E2E8F0" } })), {
  x: M, y: 2.3, w: 11.0, h: 2.2, fontFace: SANS, fontSize: 18, lineSpacingMultiple: 1.1, margin: 0,
});
card(s, M, 4.9, 11.93, 1.7, "16205A");
s.addText([
  { text: "Uso de IA:  ", options: { bold: true, color: AMBER } },
  { text: "declarado — apoio em redação, scaffolding de código/testes e formatação da referência; modelagem conferida pela equipe e validada por testes.", options: { color: "CADCFC" } },
], { x: M + 0.3, y: 5.05, w: 11.3, h: 0.7, fontFace: SANS, fontSize: 13, lineSpacingMultiple: 1.05, margin: 0 });
s.addText([
  { text: "Referência:  ", options: { bold: true, color: AMBER } },
  { text: "Yang et al. (2022), Electronic Commerce Research 22(4), DOI 10.1007/s10660-021-09468-x.", options: { color: "CADCFC", italic: true } },
], { x: M + 0.3, y: 5.75, w: 11.3, h: 0.6, fontFace: SANS, fontSize: 13, margin: 0 });
s.addText("Felipe Brazão · Gabriel Goes · Felipe Liborio  —  Obrigado!", {
  x: M, y: 6.75, w: W - 2 * M, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: WHITE, margin: 0,
});
s.addNotes("Fechar amarrando os critérios: prospecção, modelagem, persona, implementação. Declarar uso de IA. Abrir para perguntas.");

// ---- Salvar -------------------------------------------------------------
p.writeFile({ fileName: "apresentacao.pptx" }).then((f) => console.log("OK ->", f));
