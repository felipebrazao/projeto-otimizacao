"""Schemas Pydantic para validação de entrada/saída da API."""
from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field, field_validator


class ParametrosLucro(BaseModel):
    """Parâmetros do modelo L(x,y) = (a1*x - b1*x^2) + (a2*y - b2*y^2) - (x+y).

    - a1, a2 representam o retorno marginal inicial de cada canal.
    - b1, b2 representam a velocidade do retorno decrescente (precisam ser > 0
      para que a função seja côncava e tenha máximo interior).
    - Para que o ponto ótimo seja positivo (faz sentido econômico), exigimos
      a1 > 1 e a2 > 1 (caso contrário, o canal não cobre nem o custo unitário).
    """

    a1: float = Field(..., gt=1, description="Retorno marginal inicial do canal A (> 1)")
    b1: float = Field(..., gt=0, description="Coeficiente de retorno decrescente do canal A (> 0)")
    a2: float = Field(..., gt=1, description="Retorno marginal inicial do canal B (> 1)")
    b2: float = Field(..., gt=0, description="Coeficiente de retorno decrescente do canal B (> 0)")

    @field_validator("a1", "b1", "a2", "b2")
    @classmethod
    def _finito(cls, v: float) -> float:
        if v != v or v in (float("inf"), float("-inf")):
            raise ValueError("valor deve ser finito")
        return v


class ResultadoOtimizacao(BaseModel):
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
