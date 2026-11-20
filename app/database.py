import sqlite3
from pathlib import Path


CAMINHO_BANCO = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "atendeia.db"
)


def conectar():
    CAMINHO_BANCO.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    conexao = sqlite3.connect(CAMINHO_BANCO)
    conexao.row_factory = sqlite3.Row

    return conexao


def inicializar_banco():
    conexao = conectar()

    try:
        with conexao:
            conexao.execute("""
                CREATE TABLE IF NOT EXISTS pedidos (
                    codigo TEXT PRIMARY KEY,
                    status TEXT NOT NULL,
                    previsao_entrega TEXT NOT NULL
                )
            """)

            conexao.execute("""
                CREATE TABLE IF NOT EXISTS conversas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    mensagem TEXT NOT NULL,
                    resposta TEXT NOT NULL,
                    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
    finally:
        conexao.close()


def buscar_pedido(codigo: str):
    conexao = conectar()

    try:
        cursor = conexao.execute(
            """
            SELECT codigo, status, previsao_entrega
            FROM pedidos
            WHERE codigo = ?
            """,
            (codigo,)
        )

        pedido = cursor.fetchone()

        if pedido is None:
            return None

        return dict(pedido)
    finally:
        conexao.close()


def salvar_conversa(mensagem: str, resposta: str):
    conexao = conectar()

    try:
        with conexao:
            conexao.execute(
                """
                INSERT INTO conversas (mensagem, resposta)
                VALUES (?, ?)
                """,
                (mensagem, resposta)
            )
    finally:
        conexao.close()