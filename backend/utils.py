import json
import os

DATA_PATH = "data/data.json"  # ajuste se estiver em outro lugar

def identificar_clinica(numero_whatsapp: str) -> str:
    """
    Busca o ID da clínica com base no número de WhatsApp registrado no JSON.
    Retorna o ID da clínica se encontrada, ou 'clinica_desconhecida' caso contrário.
    """

    if not os.path.exists(DATA_PATH):
        return "clinica_desconhecida"

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        dados = json.load(f)

    for clinica_id, info in dados.get("clinicas", {}).items():
        if info.get("telefone") == numero_whatsapp:
            return clinica_id

    return "clinica_desconhecida"
