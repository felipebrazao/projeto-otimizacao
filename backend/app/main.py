"""API FastAPI para o otimizador de orçamento de marketing."""
from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .optimizer import amostrar_superficie, otimizar
from .schemas import ParametrosLucro, ResultadoOtimizacao

app = FastAPI(
    title="Otimizador de Orçamento de Marketing",
    description=(
        "API que recebe os parâmetros (a1, b1, a2, b2) do modelo de "
        "lucro quadrático côncavo e devolve a alocação ótima de "
        "investimento entre dois canais, com toda a justificativa "
        "matemática (gradiente, ponto crítico, Hessiana, classificação)."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {
        "nome": "Otimizador de Orçamento de Marketing",
        "endpoints": ["/otimizar (POST)", "/superficie (POST)", "/docs"],
    }


@app.post("/otimizar", response_model=ResultadoOtimizacao)
def otimizar_endpoint(params: ParametrosLucro) -> ResultadoOtimizacao:
    try:
        r = otimizar(params.a1, params.b1, params.a2, params.b2)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return ResultadoOtimizacao(**r.__dict__)


@app.post("/superficie")
def superficie_endpoint(params: ParametrosLucro) -> dict:
    return amostrar_superficie(params.a1, params.b1, params.a2, params.b2)
