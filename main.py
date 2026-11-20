from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.database import (
    inicializar_banco,
    buscar_pedido,
    salvar_conversa
)
from app.services.chat_service import gerar_resposta


@asynccontextmanager
async def lifespan(app: FastAPI):
    inicializar_banco()
    yield


app = FastAPI(
    title="AtendeIA",
    description="API para atendimento automatizado",
    lifespan=lifespan
)


class Mensagem(BaseModel):
    texto: str


@app.get("/")
def inicio():
    return {"mensagem": "AtendeIA funcionando!"}


@app.post("/chat")
def conversar(mensagem: Mensagem):
    resposta = gerar_resposta(mensagem.texto)

    salvar_conversa(mensagem.texto, resposta)

    return {"resposta": resposta}


@app.get("/pedidos/{codigo}")
def consultar_pedido(codigo: str):
    pedido = buscar_pedido(codigo)

    if pedido is None:
        raise HTTPException(
            status_code=404,
            detail="Pedido não encontrado"
        )

    return pedido