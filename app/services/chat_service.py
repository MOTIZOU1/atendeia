import re
import unicodedata
from datetime import date

from app.database import buscar_pedido


def normalizar_texto(texto: str) -> str:
    texto = texto.lower().strip()

    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(
        caractere for caractere in texto
        if unicodedata.category(caractere) != "Mn"
    )

    return texto


def gerar_resposta(mensagem: str) -> str:
    texto = normalizar_texto(mensagem)

    if not texto:
        return "Por favor, digite uma mensagem."

    # Consulta de pedidos
    if re.search(r"\bpedido\b", texto):

        resultado = re.search(
            r"\bpedido\s*(?:numero\s*)?#?\s*(\d+)\b",
            texto
        )

        if resultado is None:
            return (
                "Claro! Informe o número do pedido. "
                "Exemplo: pedido 1001."
            )

        codigo = resultado.group(1)

        pedido = buscar_pedido(codigo)

        if pedido is None:
            return (
                f"Não encontrei o pedido {codigo}. "
                "Verifique o número informado."
            )

        previsao = date.fromisoformat(
            pedido["previsao_entrega"]
        ).strftime("%d/%m/%Y")

        return (
            f"Encontrei seu pedido! "
            f"Pedido: {pedido['codigo']}. "
            f"Status: {pedido['status']}. "
            f"Previsão de entrega: {previsao}."
        )

    # Perguntas frequentes
    if "entrega" in texto or "prazo" in texto:
        return (
            "O prazo de entrega varia de acordo "
            "com a modalidade de envio."
        )

    if "horario" in texto:
        return (
            "Nosso atendimento funciona de "
            "segunda a sexta, das 8h às 18h."
        )

    if re.search(r"\b(oi|ola)\b", texto):
        return (
            "Olá! Sou o AtendeIA. "
            "Como posso ajudar você?"
        )

    return (
        "Desculpe, não entendi sua pergunta. "
        "Pode reformular?"
    )