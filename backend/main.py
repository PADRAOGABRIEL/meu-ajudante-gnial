from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from openai_client import gerar_resposta
from utils import identificar_clinica
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # ou ["*"] durante o desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Caminho para o mock que simula o Firestore
DATA_PATH = "data/data.json"

# Modelo de dados da clínica
class Clinica(BaseModel):
    id: str
    nome: str
    telefone: str
    prompt: str
    limite_mensal: int
    ativo: bool = True
    

@app.get("/")
def health():
    return {"mensagem": "API funcionando corretamente!"}



# 🔄 Carregar os dados do JSON
def carregar_dados():
    if not os.path.exists(DATA_PATH):
        return {"clinicas": {}}
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# 💾 Salvar os dados no JSON
def salvar_dados(data):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ✅ Rota para adicionar uma nova clínica
@app.post("/clinicas")
def adicionar_clinica(clinica: Clinica):
    db = carregar_dados()
    if clinica.id in db["clinicas"]:
        raise HTTPException(status_code=400, detail="Clínica já existe.")

    db["clinicas"][clinica.id] = {
        "nome": clinica.nome,
        "telefone": clinica.telefone,
        "prompt": clinica.prompt,
        "limite_mensal": clinica.limite_mensal,
        "mensagens_usadas": 0,
        "ativo": clinica.ativo,
        "chats": {}
    }


    salvar_dados(db)
    return {"status": "Clínica adicionada com sucesso"}


# ✅ Rota para listar todas as clínicas
@app.get("/clinicas")
def listar_clinicas():
    db = carregar_dados()
    return {"clinicas": db["clinicas"]}


from fastapi import Request

@app.post("/webhook")
async def receber_mensagem(request: Request):
    body = await request.json()

    try:
        entry = body["entry"][0]["changes"][0]["value"]
        numero_paciente = entry["messages"][0]["from"]
        mensagem = entry["messages"][0]["text"]["body"]
        numero_clinica = entry["metadata"]["display_phone_number"]

        db = carregar_dados()
        clinica_id = identificar_clinica(numero_clinica)  # você já deve ter uma função assim
        clinica = db["clinicas"].get(clinica_id)

        if not clinica:
            return {"error": "Clínica não encontrada."}

        # ⚠️ Verifica se clínica está ativa
        if not clinica.get("ativo", True):
            return {"error": "Clínica inativa."}

        # ⚠️ Verifica limite
        if clinica["mensagens_usadas"] >= clinica["limite_mensal"]:
            return {"error": "Limite de mensagens atingido."}

        # Prepara histórico (contexto)
        chats = clinica.setdefault("chats", {})
        chat = chats.setdefault(numero_paciente, {"contexto": [], "ultima_mensagem": "", "timestamp": ""})
        historico = chat["contexto"]

        # Atualiza histórico
        historico.append({"role": "user", "content": mensagem})

        # Gera resposta com OpenAI
        prompt = clinica.get("prompt", "Você é um assistente de uma clínica.")
        mensagens = [{"role": "system", "content": prompt}] + historico
        resposta = gerar_resposta(mensagem, historico, prompt)

        historico.append({"role": "assistant", "content": resposta})
        chat["ultima_mensagem"] = mensagem
        chat["timestamp"] = entry["messages"][0].get("timestamp", "")

        # Contabiliza +1 mensagem usada
        clinica["mensagens_usadas"] += 1

        salvar_dados(db)

        # Responder mensagem via WhatsApp API aqui (omisso)
        return {"status": "ok"}

    except Exception as e:
        return {"error": str(e)}

