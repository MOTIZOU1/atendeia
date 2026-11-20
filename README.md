# AtendeIA — Plataforma de atendimento automatizado

**AtendeIA** é uma aplicação web full-stack de demonstração para uma loja virtual fictícia. O projeto reúne uma interface responsiva em **React**, uma **API REST com FastAPI** e um banco de dados **SQLite** para consultar pedidos e registrar interações do chatbot.

> **Status:** protótipo educacional funcional, desenvolvido para estudo e portfólio. Não é um serviço comercial nem está pronto para produção.

## Visão geral

O usuário conversa com o assistente pela interface web, consulta pedidos de demonstração e recebe respostas para dúvidas comuns. A API recebe a mensagem, aplica as regras de atendimento e consulta o banco de dados quando necessário.

**Funcionalidades principais:**

- Interface de chat responsiva, com mensagens, sugestões de perguntas e indicador de envio.
- Respostas automáticas para perguntas frequentes.
- Consulta do status e da previsão de entrega de pedidos fictícios.
- Cartão de pedido exibido na interface React.
- Armazenamento de perguntas e respostas no SQLite.
- Endpoints HTTP documentados pelo Swagger UI do FastAPI.
- **Opcional:** integração com modelo de linguagem local via Ollama, apenas se os arquivos da Etapa 5 tiverem sido adicionados ao projeto.

### Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI, Pydantic |
| Banco de dados | SQLite, SQL |
| Testes | pytest, TestClient / HTTPX |
| Ferramentas | Git, GitHub, Node.js, npm |
| IA local *(opcional)* | Ollama, Gemma 3 (`gemma3:1b`) |

## Demonstração

**Interface web:** `http://127.0.0.1:5173` (quando executada localmente).  
**Documentação interativa da API:** `http://127.0.0.1:8000/docs`.

Mensagens de exemplo:

- `Olá`
- `Quero consultar o pedido 1001`
- `Quero consultar o pedido 1002`
- `Qual é o prazo de entrega?`
- `Qual é o horário de atendimento?`
- `Quero consultar o pedido 9999`

Os pedidos `1001`, `1002` e `1003` são criados por `seed.py` e não contêm informações reais de clientes.

## Instalação e execução rápida

Pré-requisitos: **Python 3.10+**, **Node.js 22** (ou outra versão aceita pelo Vite instalado), **npm** e **Git**.

### 1. Backend

Na pasta principal do projeto:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python seed.py
```

Se você tiver integrado o Ollama mas quiser executar **somente o atendimento básico**, desative a chamada ao modelo antes de iniciar a API:

```bash
export ATENDEIA_IA_ENABLED=0
```

Essa variável é reconhecida **apenas** na implementação opcional de IA; sem essa integração, não é necessária.

Em seguida:

```bash
fastapi dev main.py
```

API: <http://127.0.0.1:8000/docs>.

### 2. Frontend

Em outro terminal, na pasta principal:

```bash
cd frontend
npm install
npm run dev
```

Interface: <http://127.0.0.1:5173>.

**Mantenha os dois servidores ativos.** O Vite encaminha as chamadas `/chat` e `/pedidos` para o FastAPI durante o desenvolvimento local.

## Endpoints

| Método | Rota | Resultado |
| --- | --- | --- |
| `GET` | `/` | Confirma que a API está ativa. |
| `POST` | `/chat` | Recebe uma mensagem, gera uma resposta e registra a conversa. |
| `GET` | `/pedidos/{codigo}` | Consulta um pedido fictício, ou retorna `404` se não existir. |

Exemplo de requisição:

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H 'Content-Type: application/json' \
  -d '{"texto":"Quero consultar o pedido 1001"}'
```

Exemplo de resposta (os dados dependem do banco local):

```json
{
  "resposta": "Encontrei seu pedido! Pedido: 1001. Status: Em preparação. Previsão de entrega: 02/12/2026."
}
```

## Estrutura principal

```text
atendeia/
├── app/
│   ├── database.py              # Conexão e operações SQL
│   └── services/
│       ├── chat_service.py      # Regras e roteamento do atendimento
│       └── ia_service.py        # Somente se a IA local foi integrada
├── data/
│   ├── atendeia.db              # Criado localmente; não versionar
│   └── base_conhecimento.txt    # Somente se a IA local foi integrada
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── vite.config.js
│   └── package.json
├── tests/                      # Testes automatizados
├── main.py                     # Rotas FastAPI
├── seed.py                     # Dados fictícios
├── requirements.txt
└── README.md
```

## Testes

Instale as dependências de teste, caso ainda não estejam presentes no ambiente virtual:

```bash
python -m pip install pytest httpx
```

Para executar a suíte de testes da API incluída na documentação final:

```bash
python -m pytest -q tests/test_api.py
```

Ela utiliza um **banco temporário**, sem alterar o `data/atendeia.db`. Para validar o build do React:

```bash
cd frontend
npm run build
```

## Inteligência artificial: uso opcional

A **versão básica funciona sem Ollama**. Se você também incorporou os arquivos da Etapa 5 (`ia_service.py` e `base_conhecimento.txt`), pode habilitar o modelo local.

Nesse caso, a máquina que executa o **backend** precisa ter Ollama instalado, o modelo `gemma3:1b` disponível e o serviço em execução. Fazer commit no GitHub **não envia o executável Ollama nem os pesos do modelo**. Para o modo básico, defina `ATENDEIA_IA_ENABLED=0` antes de iniciar a API.

A implementação opcional usa respostas do SQLite para pedidos; o modelo é empregado apenas em dúvidas gerais, com fallback limitado se ficar indisponível. Não há RAG nem memória contextual de conversa nessa implementação.

## Segurança e limitações

Este projeto usa **somente dados fictícios**. Não há autenticação/autorização no endpoint de pedidos, a interface mantém seu histórico apenas em memória e o banco de dados é local. **Não publique essa API diretamente com dados reais ou sem controles adicionais.**

Evite versionar `.env`, chaves, `data/*.db`, `.venv`, `node_modules` e `dist`.

## Contexto de desenvolvimento

Projeto educacional de portfólio, desenvolvido para praticar desenvolvimento full-stack, APIs REST, consultas SQL, organização do código e testes.
