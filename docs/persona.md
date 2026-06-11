# Persona e Contexto

## Quem é

**Rafaela Mendes**, 31 anos — **Analista de Marketing Digital** em uma loja de
e-commerce de médio porte (moda e acessórios), com faturamento mensal em torno
de R$ 600 mil. Formada em Publicidade, há quatro anos cuida da operação de
mídia paga da empresa. É responsável por um orçamento mensal de marketing de
**R$ 40 mil**, que precisa dividir principalmente entre **Google Ads** (busca,
captura quem já tem intenção de compra) e **Instagram Ads** (descoberta, gera
demanda nova). Sabe ler relatórios e planilhas, mas **não tem formação em
cálculo** e não usa ferramentas de otimização matemática.

## Dor / problema explícito

Hoje a Rafaela decide a divisão da verba **"no feeling"** e por tentativa e
erro: repete a proporção do mês anterior, faz pequenos ajustes manuais e
observa o resultado só depois. O problema é que cada canal **satura** — a
partir de certo ponto, continuar colocando dinheiro no Google rende cada vez
menos, e aquele real renderia mais no Instagram (e vice-versa). Sem um critério
objetivo, ela:

- **investe demais no canal saturado** e de menos no canal com retorno ainda
  alto, desperdiçando verba;
- não consegue **justificar a alocação para a diretoria** com números — só com
  intuição;
- refaz a análise manualmente **todo mês**, gastando tempo que poderia usar em
  criativos e campanhas.

A decisão que ela precisa tomar, todo mês, é: **quanto investir em cada canal
para maximizar o lucro líquido**, e **conseguir explicar por quê**.

## Métricas de sucesso (quantitativas)

| Indicador | Situação atual (estimada) | Meta com o sistema |
|---|---|---|
| Lucro líquido mensal da mídia paga | linha de base | **+10% a +15%** ao reequilibrar a verba para o ponto ótimo |
| Verba desperdiçada em canal saturado | ~15–20% do orçamento | **< 5%** |
| Tempo para decidir a alocação do mês | ~4 horas (planilha + tentativa) | **< 5 minutos** (preencher 4 parâmetros) |
| Decisões com justificativa apresentável à diretoria | 0% (intuição) | **100%** (relatório "Como foi obtido") |

> As estimativas de receita por canal (`a₁, b₁, a₂, b₂`) Rafaela já obtém do
> histórico das próprias campanhas — o sistema apenas resolve a otimização em
> cima desses números.

## Impacto esperado do sistema

Com a aplicação, a rotina da Rafaela muda assim:

1. Ela insere quatro parâmetros que já conhece do histórico (retorno inicial e
   velocidade de saturação de cada canal).
2. Em segundos, o sistema devolve **exatamente quanto investir em cada canal**
   (`x*`, `y*`), o **lucro ótimo** esperado e a **garantia matemática** de que
   é um máximo (Hessiana negativa definida).
3. A seção **"Como foi obtido"** dá a ela uma narrativa pronta — gradiente,
   ponto crítico, classificação — para **defender a decisão na reunião** sem
   precisar saber cálculo.

Resultado: decisões **mais rápidas, mais lucrativas e defensáveis**,
substituindo o "feeling" por um critério ótimo reproduzível mês a mês.
