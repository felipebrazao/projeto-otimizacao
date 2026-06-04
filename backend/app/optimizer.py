"""Núcleo simbólico do otimizador.

Usa SymPy para construir a função lucro de duas variáveis, calcular
gradiente, ponto crítico e Hessiana, e classificar o ponto crítico
via autovalores. Também gera os "passos" como strings legíveis para a
UI poder mostrar a justificativa matemática completa.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import List

import numpy as np
import sympy as sp


@dataclass(frozen=True)
class Otimizacao:
    x_otimo: float
    y_otimo: float
    lucro_otimo: float
    receita_otima: float
    custo_otimo: float
    gradiente: List[str]
    hessiana: List[List[float]]
    autovalores: List[float]
    classificacao: str
    passos: List[str]
    funcao_latex: str


def _classificar(autovalores: List[float]) -> str:
    """Classifica o ponto crítico a partir dos autovalores da Hessiana."""
    pos = sum(1 for v in autovalores if v > 0)
    neg = sum(1 for v in autovalores if v < 0)
    if neg == len(autovalores):
        return "máximo global"
    if pos == len(autovalores):
        return "mínimo global"
    if pos > 0 and neg > 0:
        return "ponto de sela"
    return "indefinido (Hessiana semi-definida)"


def otimizar(a1: float, b1: float, a2: float, b2: float) -> Otimizacao:
    """Resolve simbolicamente a otimização do lucro de marketing.

    L(x, y) = (a1*x - b1*x²) + (a2*y - b2*y²) - (x + y)
    """
    x, y = sp.symbols("x y", real=True)
    A1, B1, A2, B2 = sp.nsimplify(a1), sp.nsimplify(b1), sp.nsimplify(a2), sp.nsimplify(b2)

    receita = (A1 * x - B1 * x**2) + (A2 * y - B2 * y**2)
    custo = x + y
    L = receita - custo

    # Gradiente
    dLdx = sp.diff(L, x)
    dLdy = sp.diff(L, y)

    # Resolve ∇L = 0
    solucoes = sp.solve([dLdx, dLdy], [x, y], dict=True)
    if not solucoes:
        raise ValueError("Sistema ∇L = 0 não tem solução para os parâmetros informados.")
    sol = solucoes[0]
    x_star = float(sol[x])
    y_star = float(sol[y])

    # Hessiana
    H = sp.Matrix([
        [sp.diff(dLdx, x), sp.diff(dLdx, y)],
        [sp.diff(dLdy, x), sp.diff(dLdy, y)],
    ])

    # Autovalores numéricos (ordem estável)
    H_num = np.array(H.tolist(), dtype=float)
    autovalores = sorted(np.linalg.eigvalsh(H_num).tolist())

    classificacao = _classificar(autovalores)

    # Avalia lucro / receita / custo no ótimo
    lucro_otimo = float(L.subs({x: x_star, y: y_star}))
    receita_otima = float(receita.subs({x: x_star, y: y_star}))
    custo_otimo = float(custo.subs({x: x_star, y: y_star}))

    passos = [
        f"1. Função lucro: L(x, y) = ({a1}·x − {b1}·x²) + ({a2}·y − {b2}·y²) − (x + y)",
        f"2. ∂L/∂x = {sp.sstr(dLdx)}",
        f"3. ∂L/∂y = {sp.sstr(dLdy)}",
        "4. Resolvemos o sistema ∇L = 0:",
        f"   • {sp.sstr(dLdx)} = 0  ⇒  x* = (a1 − 1)/(2·b1) = {x_star:.6g}",
        f"   • {sp.sstr(dLdy)} = 0  ⇒  y* = (a2 − 1)/(2·b2) = {y_star:.6g}",
        f"5. Hessiana H = [[{H_num[0,0]:.6g}, {H_num[0,1]:.6g}], "
        f"[{H_num[1,0]:.6g}, {H_num[1,1]:.6g}]]",
        f"6. Autovalores de H: {autovalores[0]:.6g} e {autovalores[1]:.6g}",
        f"7. Como ambos autovalores são {'<' if classificacao == 'máximo global' else '>'} 0, "
        f"H é {'negativa' if classificacao == 'máximo global' else 'positiva'} definida → "
        f"ponto crítico é {classificacao}.",
        f"8. Lucro ótimo: L(x*, y*) = {lucro_otimo:.6g}",
    ]

    return Otimizacao(
        x_otimo=x_star,
        y_otimo=y_star,
        lucro_otimo=lucro_otimo,
        receita_otima=receita_otima,
        custo_otimo=custo_otimo,
        gradiente=[sp.sstr(dLdx), sp.sstr(dLdy)],
        hessiana=H_num.tolist(),
        autovalores=autovalores,
        classificacao=classificacao,
        passos=passos,
        funcao_latex=sp.latex(L),
    )


def amostrar_superficie(
    a1: float,
    b1: float,
    a2: float,
    b2: float,
    n: int = 40,
    fator: float = 2.0,
) -> dict:
    """Gera uma malha (x, y, z) para o gráfico 3D.

    Centra a malha no ponto ótimo e estende até `fator` vezes esse valor
    em cada direção, para que o usuário veja claramente o pico.
    """
    x_star = (a1 - 1.0) / (2.0 * b1)
    y_star = (a2 - 1.0) / (2.0 * b2)

    x_max = max(2.0 * x_star, 1.0) * fator / 2.0
    y_max = max(2.0 * y_star, 1.0) * fator / 2.0

    xs = np.linspace(0.0, x_max, n)
    ys = np.linspace(0.0, y_max, n)
    X, Y = np.meshgrid(xs, ys)
    Z = (a1 * X - b1 * X**2) + (a2 * Y - b2 * Y**2) - (X + Y)

    return {
        "x": xs.tolist(),
        "y": ys.tolist(),
        "z": Z.tolist(),
        "x_otimo": x_star,
        "y_otimo": y_star,
        "z_otimo": float((a1 * x_star - b1 * x_star**2)
                         + (a2 * y_star - b2 * y_star**2)
                         - (x_star + y_star)),
    }
