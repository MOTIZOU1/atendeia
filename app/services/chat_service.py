import unicodedata


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
    palavras = texto.split()

    if not texto:
        return "Por favor, digite uma mensagem."

    if "pedido" in texto:
        return (
            "Posso ajudar a consultar seu pedido! "
            "Em breve teremos essa funcionalidade."
        )

    elif "entrega" in texto or "prazo" in texto:
        return (
            "O prazo de entrega varia de acordo "
            "com a modalidade de envio."
        )

    elif "horario" in texto:
        return (
            "Nosso atendimento funciona de "
            "segunda a sexta, das 8h às 18h."
        )

    elif "oi" in palavras or "ola" in palavras:
        return (
            "Olá! Sou o AtendeIA. "
            "Como posso ajudar você?"
        )

    else:
        return (
            "Desculpe, não entendi sua pergunta. "
            "Pode reformular?"
        )