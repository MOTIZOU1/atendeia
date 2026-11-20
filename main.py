from fastapi import FastAPI
from pydantic import BaseModel

from app.services.chat_service import gerar_resposta

app = FastAPI(
    title="AtendeIA",
    description="API para atendimento automatizado"
)


class Mensagem(BaseModel):
    texto: str


@app.get("/")
def inicio():
    return {"mensagem": "AtendeIA funcionando!"}


@app.post("/chat")
def conversar(mensagem: Mensagem):
    resposta = gerar_resposta(mensagem.texto)

    return {"resposta": resposta}