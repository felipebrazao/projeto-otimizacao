import math

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.optimizer import otimizar


def test_ponto_otimo_formula_fechada():
    """x* = (a1-1)/(2 b1), y* = (a2-1)/(2 b2)."""
    r = otimizar(a1=10, b1=0.5, a2=8, b2=0.4)
    assert math.isclose(r.x_otimo, (10 - 1) / (2 * 0.5), rel_tol=1e-9)
    assert math.isclose(r.y_otimo, (8 - 1) / (2 * 0.4), rel_tol=1e-9)


def test_classificacao_eh_maximo_global():
    r = otimizar(a1=5, b1=0.2, a2=4, b2=0.3)
    assert r.classificacao == "máximo global"
    # Hessiana negativa definida → todos autovalores < 0
    assert all(v < 0 for v in r.autovalores)


def test_lucro_otimo_eh_maior_que_vizinhanca():
    r = otimizar(a1=10, b1=0.5, a2=8, b2=0.4)
    L = lambda x, y: (10 * x - 0.5 * x ** 2) + (8 * y - 0.4 * y ** 2) - (x + y)
    base = L(r.x_otimo, r.y_otimo)
    for dx, dy in [(0.1, 0), (-0.1, 0), (0, 0.1), (0, -0.1), (0.5, 0.5)]:
        assert L(r.x_otimo + dx, r.y_otimo + dy) <= base + 1e-9


def test_hessiana_simetrica_e_diagonal():
    r = otimizar(a1=3, b1=0.1, a2=2, b2=0.5)
    H = r.hessiana
    assert H[0][1] == 0
    assert H[1][0] == 0
    assert H[0][0] == pytest.approx(-2 * 0.1)
    assert H[1][1] == pytest.approx(-2 * 0.5)


def test_validacao_rejeita_b_negativo():
    client = TestClient(app)
    resp = client.post(
        "/otimizar",
        json={"a1": 10, "b1": -0.5, "a2": 8, "b2": 0.4},
    )
    assert resp.status_code == 422


def test_validacao_rejeita_a_menor_que_um():
    client = TestClient(app)
    resp = client.post(
        "/otimizar",
        json={"a1": 0.5, "b1": 0.5, "a2": 8, "b2": 0.4},
    )
    assert resp.status_code == 422


def test_endpoint_otimizar_retorna_estrutura_completa():
    client = TestClient(app)
    resp = client.post(
        "/otimizar",
        json={"a1": 10, "b1": 0.5, "a2": 8, "b2": 0.4},
    )
    assert resp.status_code == 200
    data = resp.json()
    for chave in [
        "x_otimo", "y_otimo", "lucro_otimo",
        "gradiente", "hessiana", "autovalores",
        "classificacao", "passos", "funcao_latex",
    ]:
        assert chave in data
    assert data["classificacao"] == "máximo global"
    assert len(data["passos"]) >= 5


def test_endpoint_superficie_retorna_malha():
    client = TestClient(app)
    resp = client.post(
        "/superficie",
        json={"a1": 10, "b1": 0.5, "a2": 8, "b2": 0.4},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["x"]) == len(data["y"])
    assert len(data["z"]) == len(data["y"])
    assert len(data["z"][0]) == len(data["x"])
