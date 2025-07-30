import requests
import os

def responder_mensagem(numero_destino, texto):
    url = f"https://graph.facebook.com/v19.0/{os.getenv('WHATSAPP_PHONE_ID')}/messages"
    headers = {
        "Authorization": f"Bearer {os.getenv('WHATSAPP_TOKEN')}",
        "Content-Type": "application/json"
    }
    body = {
        "messaging_product": "whatsapp",
        "to": numero_destino,
        "type": "text",
        "text": {"body": texto}
    }
    r = requests.post(url, headers=headers, json=body)
    return r.json()
