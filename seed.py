from app.database import conectar, inicializar_banco


def inserir_pedidos():
    inicializar_banco()

    pedidos = [
        ("1001", "Em preparação", "2026-12-02"),
        ("1002", "Em transporte", "2026-11-27"),
        ("1003", "Saiu para entrega", "2026-11-23")
    ]

    conexao = conectar()

    try:
        with conexao:
            conexao.executemany(
                """
                INSERT OR IGNORE INTO pedidos
                (codigo, status, previsao_entrega)
                VALUES (?, ?, ?)
                """,
                pedidos
            )
    finally:
        conexao.close()

    print("Pedidos fictícios cadastrados!")


if __name__ == "__main__":
    inserir_pedidos()