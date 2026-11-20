"""Testes básicos da API; independentes do Ollama e do banco do usuário.

Execute a partir da raiz do repositório:
    python -m pytest -q tests/test_api.py

Pré-requisitos: pytest, httpx, fastapi e o projeto AtendeIA.
"""

import pytest
from fastapi.testclient import TestClient

import app.database as database
import main


@pytest.fixture
def client(tmp_path, monkeypatch):
    """Inicializa as tabelas em um SQLite temporário para cada teste."""
    monkeypatch.setattr(database, "CAMINHO_BANCO", tmp_path / "atendeia_teste.db")

    with TestClient(main.app) as api:
        conexao = database.conectar()
        try:
            with conexao:
                conexao.execute(
                    """INSERT INTO pedidos
                       (codigo, status, previsao_entrega)
                       VALUES (?, ?, ?)""",
                    ("1001", "Em preparação", "2026-12-02"),
                )
        finally:
            conexao.close()

        yield api


def test_api_esta_online(client):
    resposta = client.get("/")
    assert resposta.status_code == 200


def test_consulta_pedido_existente(client):
    resposta = client.get("/pedidos/1001")
    assert resposta.status_code == 200
    assert resposta.json() == {
        "codigo": "1001",
        "status": "Em preparação",
        "previsao_entrega": "2026-12-02",
    }


def test_consulta_pedido_inexistente(client):
    resposta = client.get("/pedidos/9999")
    assert resposta.status_code == 404


def test_chat_consulta_pedido(client):
    resposta = client.post("/chat", json={"texto": "Quero consultar o pedido 1001"})
    assert resposta.status_code == 200
    assert "Pedido: 1001" in resposta.json()["resposta"]
    assert "Em preparação" in resposta.json()["resposta"]


def test_chat_pedido_inexistente(client):
    resposta = client.post("/chat", json={"texto": "pedido 9999"})
    assert resposta.status_code == 200
    assert "Não encontrei" in resposta.json()["resposta"]


def test_chat_mensagem_vazia(client):
    resposta = client.post("/chat", json={"texto": "  "})
    assert resposta.status_code == 200
    assert "digite uma mensagem" in resposta.json()["resposta"]


def test_chat_exige_texto(client):
    resposta = client.post("/chat", json={})
    assert resposta.status_code == 422


def test_chat_salva_conversa(client):
    mensagem = "Quero consultar o pedido 1001"
    resposta = client.post("/chat", json={"texto": mensagem})
    assert resposta.status_code == 200

    conexao = database.conectar()
    try:
        registro = conexao.execute(
            "SELECT mensagem, resposta FROM conversas ORDER BY id DESC LIMIT 1"
        ).fetchone()
    finally:
        conexao.close()

    assert registro is not None
    assert registro["mensagem"] == mensagem
    assert registro["resposta"] == resposta.json()["resposta"]
