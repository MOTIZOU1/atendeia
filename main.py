from fastapi import FastAPI
from pydantic import BaseModel

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
    return {
        "resposta": f"Você disse: {mensagem.texto}"
    }