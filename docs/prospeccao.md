# Prospecção do Problema (PBL)

## 1. Referência completa do artigo

> **Yang, Y., Feng, B., Salminen, J., & Jansen, B. J. (2022).** *Optimal
> advertising for a generalized Vidale–Wolfe response model.* **Electronic
> Commerce Research**, v. 22, n. 4, p. 1275–1305.
> DOI: [10.1007/s10660-021-09468-x](https://doi.org/10.1007/s10660-021-09468-x).
> Springer Nature.

Artigo revisado por pares (periódico *Electronic Commerce Research*, Qualis
internacional, editora Springer). Os experimentos do artigo usam dados reais
de campanhas de três empresas de e-commerce no **Google AdWords**, **Facebook
Ads** e **Baidu Ads** — exatamente o tipo de decisão multicanal que o nosso
sistema automatiza.

## 2. Recorte do artigo (trecho que justifica o problema)

O artigo formula a decisão de **quanto investir em publicidade** como um
problema de otimização e demonstra empiricamente o fenômeno de **retorno
marginal decrescente**, que é a hipótese central da nossa modelagem:

> "As the total budget increases, the resulting payoff by the GVW-OB strategy
> increases monotonically, but the ROI decreases, which is **consistent with
> the law of diminishing marginal utility**."
>
> — Yang et al. (2022), seção de resultados experimentais.

O artigo também observa que a curva de resposta da publicidade pode assumir
formato **côncavo** ou em **S**, e que, no regime côncavo, cada real adicional
investido em um canal gera **menos receita incremental** que o anterior. É
precisamente essa concavidade que garante a existência de um ponto de
investimento ótimo (nem investir de menos, nem saturar o canal).

## 3. Justificativa da escolha (adequação ao conteúdo da disciplina)

O problema é adequado à disciplina de **funções de várias variáveis,
derivadas parciais, gradiente e otimização** pelos seguintes motivos:

1. **Mais de duas variáveis de decisão reais e independentes.** O orçamento é
   dividido entre, no mínimo, dois canais de mídia (no artigo: Google,
   Facebook, Baidu). No nosso recorte, modelamos dois canais — `x` e `y` —, o
   que produz uma função objetivo de **duas variáveis** `L(x, y)`, satisfazendo
   o requisito de "≥ 2 variáveis bem articuladas".

2. **Retorno marginal decrescente ⇒ função côncava.** A "lei da utilidade
   marginal decrescente" citada no artigo se traduz matematicamente em
   **concavidade** da receita de cada canal. Isso garante uma Hessiana
   **negativa definida** e, portanto, um **máximo global interior** — caso
   ideal para aplicar o critério da Hessiana visto em aula.

3. **O ótimo é encontrado anulando o gradiente.** A condição de otimalidade do
   artigo (igualar o retorno marginal entre canais — o *princípio
   equimarginal*) é exatamente a solução do sistema **∇L = 0**, que é o
   conteúdo central da disciplina.

4. **Problema real com persona clara.** Decidir a alocação de verba de
   marketing é uma dor concreta de analistas e gestores de e-commerce — o que
   permite construir uma persona realista (ver [persona.md](persona.md)) e um
   sistema que entrega valor prático.

### Do artigo para o nosso recorte (simplificação adotada)

O artigo de Yang et al. usa um modelo **dinâmico** (controle ótimo sobre o
tempo, equação de Vidale–Wolfe generalizada). Para manter o problema dentro do
escopo de **otimização estática de várias variáveis** da disciplina, adotamos
a versão **estática e côncava** do mesmo fenômeno: modelamos a receita de cada
canal como uma parábola côncava `aᵢ·t − bᵢ·t²` (retorno marginal decrescente
linearizado), preservando a essência econômica do artigo — *diminishing
returns* — em uma função `L(x, y)` de duas variáveis tratável analiticamente.

A modelagem matemática completa está em
[modelo-matematico.md](modelo-matematico.md).
