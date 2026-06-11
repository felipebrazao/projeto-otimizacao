"""Gera o relatório do projeto em PDF (reportlab).

Reprodutível: `python relatorio/gerar_relatorio.py` cria
`relatorio/relatorio.pdf`. Usa a fonte Cambria (Windows) para cobrir os
símbolos matemáticos (∂, ∇, λ, ⇒, ℝ, subscritos ₁₂ e ²); se Cambria não
existir, cai para Helvetica.

Os valores do exemplo numérico usam as mesmas fórmulas fechadas resolvidas
pelo back end (e validadas pelos testes em backend/tests/).
"""
from __future__ import annotations

import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# --------------------------------------------------------------------------
# Fontes. Precisamos de cobertura completa dos símbolos matemáticos
# (∂, ∇, λ, ⇒, ℝ, subscritos ₁₂ e sobrescritos ²). A família Cambria, do
# Windows, cobre todos eles; caímos para Helvetica se não existir.
# --------------------------------------------------------------------------
BASE, BOLD, ITALIC = "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"
WIN_FONTS = r"C:\Windows\Fonts"
try:
    # cambria.ttc é uma coleção (Cambria + Cambria Math) -> subfontIndex=0.
    pdfmetrics.registerFont(TTFont("Cambria", os.path.join(WIN_FONTS, "cambria.ttc"), subfontIndex=0))
    pdfmetrics.registerFont(TTFont("Cambria-Bold", os.path.join(WIN_FONTS, "cambriab.ttf")))
    pdfmetrics.registerFont(TTFont("Cambria-Italic", os.path.join(WIN_FONTS, "cambriai.ttf")))
    BASE, BOLD, ITALIC = "Cambria", "Cambria-Bold", "Cambria-Italic"
except Exception:  # pragma: no cover - fallback de ambiente
    pass

# --------------------------------------------------------------------------
# Estilos
# --------------------------------------------------------------------------
styles = getSampleStyleSheet()
INK = colors.HexColor("#0f172a")
MUTED = colors.HexColor("#475569")
ACCENT = colors.HexColor("#4f46e5")

S = {
    "title": ParagraphStyle("title", parent=styles["Title"], fontName=BOLD,
                             fontSize=22, leading=26, textColor=INK, spaceAfter=6),
    "subtitle": ParagraphStyle("subtitle", fontName=BASE, fontSize=12,
                               leading=16, textColor=MUTED, alignment=TA_CENTER),
    "h1": ParagraphStyle("h1", fontName=BOLD, fontSize=14, leading=18,
                         textColor=ACCENT, spaceBefore=14, spaceAfter=6),
    "h2": ParagraphStyle("h2", fontName=BOLD, fontSize=11.5, leading=15,
                         textColor=INK, spaceBefore=8, spaceAfter=3),
    "body": ParagraphStyle("body", fontName=BASE, fontSize=10, leading=15,
                           textColor=INK, alignment=TA_JUSTIFY, spaceAfter=6),
    "eq": ParagraphStyle("eq", fontName=BASE, fontSize=11, leading=18,
                         textColor=INK, alignment=TA_CENTER, spaceBefore=4,
                         spaceAfter=8, backColor=colors.HexColor("#f1f5f9")),
    "small": ParagraphStyle("small", fontName=BASE, fontSize=8.5, leading=12,
                            textColor=MUTED),
    "quote": ParagraphStyle("quote", fontName=ITALIC, fontSize=9.5, leading=14,
                            textColor=MUTED, leftIndent=14, rightIndent=10,
                            spaceAfter=6, borderColor=ACCENT, borderWidth=0),
}


def P(text, style="body"):
    return Paragraph(text, S[style])


def EQ(text):
    return Paragraph(f"&nbsp;{text}&nbsp;", S["eq"])


def rule():
    return HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#cbd5e1"),
                      spaceBefore=2, spaceAfter=8)


# --------------------------------------------------------------------------
# Exemplo numérico (mesmas fórmulas fechadas do back end)
# --------------------------------------------------------------------------
a1, b1, a2, b2 = 10.0, 0.5, 8.0, 0.4
x_star = (a1 - 1) / (2 * b1)
y_star = (a2 - 1) / (2 * b2)
L_star = (a1 - 1) ** 2 / (4 * b1) + (a2 - 1) ** 2 / (4 * b2)


def build():
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, "relatorio.pdf")
    doc = SimpleDocTemplate(
        out, pagesize=A4,
        leftMargin=2.2 * cm, rightMargin=2.2 * cm,
        topMargin=2.0 * cm, bottomMargin=2.0 * cm,
        title="Relatório — Otimização de Orçamento de Marketing",
        author="Felipe Brazão, Gabriel Goes, Felipe Liborio",
    )
    f = []  # flowables

    # ---- Capa -----------------------------------------------------------
    f += [Spacer(1, 1.2 * cm)]
    f += [P("Centro Universitário do Pará", "subtitle")]
    f += [P("Curso de Ciência da Computação", "subtitle")]
    f += [P("Resolução de Problemas Multivariáveis — Prof. Pedro Girotto", "subtitle")]
    f += [Spacer(1, 1.6 * cm)]
    f += [P("Otimização da Alocação de<br/>Orçamento de Marketing", "title")]
    f += [P("Maximização do lucro entre dois canais de mídia com retorno "
            "marginal decrescente, via gradiente e critério da Hessiana.", "subtitle")]
    f += [Spacer(1, 1.4 * cm)]
    f += [rule()]
    equipe = Table(
        [[P("<b>Equipe</b>", "body"), P("Felipe Brazão &nbsp;·&nbsp; Gabriel Goes "
                                         "&nbsp;·&nbsp; Felipe Liborio", "body")],
         [P("<b>Data</b>", "body"), P("Belém, junho de 2026", "body")],
         [P("<b>Repositório</b>", "body"), P("projeto-otimização (full stack: "
                                             "FastAPI + SymPy + React)", "body")]],
        colWidths=[3.5 * cm, 12 * cm])
    equipe.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    f += [equipe, rule()]
    f += [PageBreak()]

    # ---- 1. Resumo ------------------------------------------------------
    f += [P("Resumo", "h1")]
    f += [P(
        "Este trabalho parte de um problema real de marketing digital — como "
        "dividir um orçamento entre canais de mídia que apresentam retorno "
        "decrescente — e o modela como a maximização de uma função de duas "
        "variáveis <i>L(x, y)</i>. Calculamos o gradiente, resolvemos ∇L = 0 "
        "para obter o ponto crítico em forma fechada e o classificamos como "
        "máximo global pelo critério da Hessiana. Em seguida, entregamos uma "
        "aplicação full stack que automatiza todo o processo para uma persona "
        "não especialista, exibindo a recomendação, a superfície 3D do lucro e "
        "uma explicação acessível de como a solução foi obtida.")]

    # ---- 2. Prospecção --------------------------------------------------
    f += [P("1. Prospecção do Problema (PBL)", "h1")]
    f += [P("Referência", "h2")]
    f += [P(
        "Yang, Y., Feng, B., Salminen, J., &amp; Jansen, B. J. (2022). "
        "<i>Optimal advertising for a generalized Vidale–Wolfe response "
        "model.</i> <b>Electronic Commerce Research</b>, 22(4), 1275–1305. "
        "DOI: 10.1007/s10660-021-09468-x. Springer Nature.")]
    f += [P("Artigo revisado por pares cujos experimentos usam dados reais de "
            "campanhas de e-commerce no Google AdWords, Facebook Ads e Baidu "
            "Ads.", "small")]
    f += [P("Recorte", "h2")]
    f += [P("“As the total budget increases, the resulting payoff (…) increases "
            "monotonically, but the ROI decreases, which is consistent with the "
            "law of diminishing marginal utility.” — Yang et al. (2022).", "quote")]
    f += [P("O artigo evidencia que a curva de resposta da publicidade é "
            "<b>côncava</b>: cada real adicional investido em um canal gera "
            "menos receita incremental que o anterior. É essa concavidade que "
            "garante a existência de um ponto de investimento ótimo.")]
    f += [P("Justificativa", "h2")]
    f += [P(
        "O problema é adequado à disciplina porque: (i) a verba é dividida "
        "entre <b>dois ou mais canais</b>, gerando uma função objetivo de "
        "<b>várias variáveis</b>; (ii) o retorno marginal decrescente se "
        "traduz em <b>concavidade</b>, garantindo Hessiana negativa definida e "
        "máximo global interior; (iii) a condição de otimalidade do artigo "
        "(igualar o retorno marginal entre canais) é exatamente a solução do "
        "sistema ∇L = 0; e (iv) é uma dor concreta de uma persona realista. "
        "Para manter o escopo de otimização estática, adotamos a versão "
        "estática e côncava do modelo dinâmico do artigo, preservando a "
        "essência econômica (<i>diminishing returns</i>).")]

    # ---- 3. Persona -----------------------------------------------------
    f += [P("2. Persona e Contexto", "h1")]
    f += [P(
        "<b>Rafaela Mendes</b>, 31 anos, analista de marketing digital de um "
        "e-commerce de moda (faturamento ~R$ 600 mil/mês). Há quatro anos "
        "cuida da mídia paga e administra um orçamento mensal de <b>R$ 40 "
        "mil</b>, dividido principalmente entre <b>Google Ads</b> e <b>Instagram "
        "Ads</b>. Tem desenvoltura com planilhas, mas não tem formação em "
        "cálculo.")]
    f += [P("Dor", "h2")]
    f += [P(
        "Hoje ela decide a divisão da verba “no feeling” e por tentativa e "
        "erro. Como cada canal <b>satura</b>, ela acaba investindo demais no "
        "canal saturado e de menos no que ainda renderia — desperdiçando verba "
        "— e não consegue justificar a alocação para a diretoria com números.")]
    f += [P("Métricas de sucesso", "h2")]
    metr = Table(
        [[P("<b>Indicador</b>", "small"), P("<b>Atual</b>", "small"),
          P("<b>Meta com o sistema</b>", "small")],
         [P("Lucro líquido da mídia paga", "small"), P("linha de base", "small"),
          P("+10% a +15%", "small")],
         [P("Verba desperdiçada em canal saturado", "small"),
          P("15–20% do orçamento", "small"), P("&lt; 5%", "small")],
         [P("Tempo para decidir a alocação", "small"), P("~4 horas", "small"),
          P("&lt; 5 minutos", "small")],
         [P("Decisões justificáveis à diretoria", "small"), P("0% (intuição)", "small"),
          P("100%", "small")]],
        colWidths=[7.4 * cm, 4 * cm, 4.1 * cm])
    metr.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef2ff")),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    f += [metr, Spacer(1, 4)]
    f += [P("Impacto esperado", "h2")]
    f += [P(
        "Rafaela insere quatro parâmetros que já conhece do histórico das "
        "campanhas e recebe, em segundos, quanto investir em cada canal "
        "(x*, y*), o lucro ótimo esperado e a garantia matemática de que é um "
        "máximo. A seção “Como foi obtido” dá a ela uma narrativa pronta para "
        "defender a decisão na reunião — substituindo o “feeling” por um "
        "critério ótimo reproduzível mês a mês.")]

    f += [PageBreak()]

    # ---- 4. Modelagem ---------------------------------------------------
    f += [P("3. Modelagem Matemática", "h1")]
    f += [P("3.1. Variáveis de decisão e parâmetros", "h2")]
    f += [P(
        "<b>x</b> = investimento no canal A (Google Ads), em milhares de R$, "
        "x ≥ 0.<br/>"
        "<b>y</b> = investimento no canal B (Instagram Ads), em milhares de R$, "
        "y ≥ 0.<br/>"
        "<b>a₁, a₂</b> = retorno marginal inicial de cada canal (aᵢ &gt; 1, para "
        "que o canal cubra o custo unitário do investimento).<br/>"
        "<b>b₁, b₂</b> = coeficiente de saturação de cada canal (bᵢ &gt; 0, "
        "garante a concavidade da receita).")]

    f += [P("3.2. Função objetivo", "h2")]
    f += [P("A receita de um canal com investimento <i>t</i> modela o retorno "
            "decrescente como uma parábola côncava:")]
    f += [EQ("R(t) = aᵢ·t − bᵢ·t²")]
    f += [P("O retorno marginal R′(t) = aᵢ − 2bᵢ·t decresce com t (cada real "
            "rende menos que o anterior). Considerando que 1 R$ investido custa "
            "1 R$, o <b>lucro total</b> é a receita dos dois canais menos o "
            "custo:")]
    f += [EQ("L(x, y) = (a₁·x − b₁·x²) + (a₂·y − b₂·y²) − (x + y)")]

    f += [P("3.3. Domínio e restrições", "h2")]
    f += [P("Domínio: D = { (x, y) ∈ ℝ² : x ≥ 0, y ≥ 0 }. Não se investe valor "
            "negativo. Com aᵢ &gt; 1 e bᵢ &gt; 0, o ponto crítico cai no "
            "interior do domínio (x*, y* &gt; 0), de modo que não há necessidade "
            "de checar a fronteira.")]

    f += [P("3.4. Derivadas parciais e gradiente", "h2")]
    f += [P("Derivando L em relação a cada variável:")]
    f += [EQ("∂L/∂x = a₁ − 2b₁·x − 1 &nbsp;&nbsp;&nbsp; ∂L/∂y = a₂ − 2b₂·y − 1")]
    f += [EQ("∇L = ( a₁ − 2b₁·x − 1 , &nbsp; a₂ − 2b₂·y − 1 )")]

    f += [P("3.5. Ponto crítico (anulando o gradiente)", "h2")]
    f += [P("Igualando cada componente do gradiente a zero, o sistema é "
            "desacoplado e tem solução única em forma fechada:")]
    f += [EQ("x* = (a₁ − 1) / (2b₁) &nbsp;&nbsp;&nbsp; y* = (a₂ − 1) / (2b₂)")]

    f += [P("3.6. Hessiana e classificação", "h2")]
    f += [P("A matriz Hessiana das segundas derivadas é constante (não depende "
            "de x, y):")]
    f += [EQ("H = [ −2b₁ &nbsp; 0 ; &nbsp; 0 &nbsp; −2b₂ ]")]
    f += [P("Os autovalores são λ₁ = −2b₁ e λ₂ = −2b₂. Como bᵢ &gt; 0, ambos "
            "são <b>estritamente negativos</b> ⇒ H é <b>negativa definida</b> em "
            "todo o plano ⇒ L é estritamente côncava ⇒ o único ponto crítico "
            "(x*, y*) é um <b>máximo global</b>. Não há máximos locais "
            "concorrentes nem fronteira a verificar.")]

    f += [P("3.7. Valor ótimo e sensibilidade", "h2")]
    f += [P("Substituindo o ponto crítico em L:")]
    f += [EQ("L(x*, y*) = (a₁ − 1)² / (4b₁) + (a₂ − 1)² / (4b₂)")]
    f += [P("A análise de sensibilidade (Teorema do Envelope) mostra que "
            "∂L*/∂a₁ = x*: um aumento marginal no retorno inicial de um canal "
            "eleva o lucro ótimo na proporção do investimento ótimo naquele "
            "canal. O lucro cresce com aᵢ (canal mais produtivo) e decresce com "
            "bᵢ (canal que satura mais rápido).")]

    f += [PageBreak()]

    # ---- 5. Exemplo numérico -------------------------------------------
    f += [P("4. Exemplo Numérico e Interpretação", "h1")]
    f += [P(f"Com os parâmetros estimados pela persona — a₁ = {a1:g}, "
            f"b₁ = {b1:g}, a₂ = {a2:g}, b₂ = {b2:g} — obtemos:")]
    ex = Table(
        [[P("<b>Grandeza</b>", "small"), P("<b>Cálculo</b>", "small"),
          P("<b>Resultado</b>", "small")],
         [P("Investir no canal A (x*)", "small"),
          P(f"({a1:g} − 1) / (2·{b1:g})", "small"),
          P(f"<b>{x_star:.2f}</b> (mil R$)", "small")],
         [P("Investir no canal B (y*)", "small"),
          P(f"({a2:g} − 1) / (2·{b2:g})", "small"),
          P(f"<b>{y_star:.2f}</b> (mil R$)", "small")],
         [P("Lucro ótimo L(x*, y*)", "small"),
          P(f"{(a1-1)**2/(4*b1):.3g} + {(a2-1)**2/(4*b2):.3g}", "small"),
          P(f"<b>{L_star:.3f}</b> (mil R$)", "small")],
         [P("Autovalores da Hessiana", "small"),
          P(f"−2·{b1:g} ; −2·{b2:g}", "small"),
          P(f"{-2*b1:g} ; {-2*b2:g} (&lt; 0)", "small")]],
        colWidths=[5.5 * cm, 5 * cm, 5 * cm])
    ex.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef2ff")),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    f += [ex, Spacer(1, 6)]
    f += [P(
        f"<b>Interpretação:</b> a persona deve investir <b>R$ "
        f"{x_star*1000:,.0f}</b> no canal A e <b>R$ {y_star*1000:,.0f}</b> no "
        f"canal B, gerando um lucro líquido de aproximadamente <b>R$ "
        f"{L_star*1000:,.0f}</b>. Como ambos os autovalores são negativos, o "
        "sistema garante que essa é a melhor alocação possível — qualquer "
        "deslocamento reduz o lucro. Investir mais no canal A o levaria à "
        "saturação; investir mais no B desperdiçaria verba que rende mais no "
        "A.".replace(",", "."))]

    # ---- 6. Implementação ----------------------------------------------
    f += [P("5. Implementação (Full Stack)", "h1")]
    f += [P("O sistema segue o fluxo: a persona insere os parâmetros no front "
            "end → o back end calcula a solução ótima → o front end exibe a "
            "recomendação e a justificativa.")]
    f += [P("Back end — FastAPI + SymPy", "h2")]
    f += [P(
        "O endpoint <font face='%s'>POST /otimizar</font> recebe (a₁, b₁, a₂, "
        "b₂), validados por Pydantic (aᵢ &gt; 1, bᵢ &gt; 0). O módulo "
        "<font face='%s'>optimizer.py</font> usa <b>SymPy</b> para derivar "
        "simbolicamente ∂L/∂x e ∂L/∂y, resolver o sistema ∇L = 0, montar a "
        "Hessiana e classificá-la pelos autovalores (NumPy). Retorna x*, y*, "
        "L(x*, y*), receita, custo, a Hessiana, os autovalores, a classificação "
        "e a lista de <b>passos</b> legíveis. Um segundo endpoint "
        "<font face='%s'>/superficie</font> gera a malha 3D do lucro. A "
        "corretude é garantida por <b>8 testes pytest</b> (forma fechada do "
        "ótimo, classificação, simetria da Hessiana e validação de entrada)."
        % (BASE, BASE, BASE))]
    f += [P("Front end — React + Tailwind + Plotly", "h2")]
    f += [P(
        "Interface em que a persona preenche os quatro parâmetros e visualiza: "
        "(i) a <b>recomendação</b> em cartões — quanto investir em cada canal e "
        "o lucro ótimo, formatados em R$; (ii) a <b>superfície 3D</b> do lucro "
        "com o ponto ótimo destacado; e (iii) a seção <b>“Como foi obtido”</b>, "
        "que lista os passos matemáticos retornados pelo back end. Nenhum "
        "conhecimento de cálculo é exigido do usuário.")]

    # ---- 7. Como foi obtido (acessível) --------------------------------
    f += [P("6. Como a Solução foi Obtida (versão acessível)", "h1")]
    f += [P(
        "Cada canal de marketing rende cada vez menos à medida que recebe mais "
        "dinheiro (satura). O “ponto ótimo” é aquele em que o último real "
        "investido em A rende o mesmo que o último real investido em B — daí em "
        "diante, mover verba de um para o outro só piora o resultado. "
        "Matematicamente, isso acontece onde as duas <i>inclinações</i> do "
        "lucro (as derivadas parciais) são zero ao mesmo tempo. Resolvendo essa "
        "condição chegamos a x* e y*. O teste da Hessiana confirma que é um "
        "<b>pico</b> (e não um vale ou uma sela): como a curva é “arqueada para "
        "baixo” nas duas direções, o ponto encontrado é o de <b>lucro máximo</b>.")]

    # ---- 8. IA + Referências -------------------------------------------
    f += [P("7. Declaração de Uso de IA", "h1")]
    f += [P(
        "Ferramentas de IA (Claude) foram usadas como apoio para redação e "
        "revisão de texto, scaffolding inicial do código e dos testes, e "
        "localização/formatação da referência bibliográfica. A modelagem "
        "matemática foi conferida manualmente pela equipe e os resultados "
        "numéricos são validados pelos testes automatizados. Nenhum conteúdo "
        "foi entregue sem revisão humana.")]

    f += [P("Referências", "h1")]
    f += [P(
        "Yang, Y., Feng, B., Salminen, J., &amp; Jansen, B. J. (2022). Optimal "
        "advertising for a generalized Vidale–Wolfe response model. "
        "<i>Electronic Commerce Research</i>, 22(4), 1275–1305. "
        "https://doi.org/10.1007/s10660-021-09468-x", "small")]
    f += [P(
        "Stewart, J. <i>Cálculo, Volume 2.</i> (funções de várias variáveis, "
        "derivadas parciais, gradiente e máximos/mínimos — critério da "
        "Hessiana).", "small")]

    doc.build(f)
    print(f"OK -> {out}")


if __name__ == "__main__":
    build()
