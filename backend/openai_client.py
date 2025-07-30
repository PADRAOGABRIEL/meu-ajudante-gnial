import openai
import os

openai.api_key = os.getenv("OPENAI_KEY")

import openai
import os

openai.api_key = os.getenv("OPENAI_KEY")

def gerar_resposta(msg, historico, system_prompt):
    mensagens = [{"role": "system", "content": system_prompt}] + historico + [{"role": "user", "content": msg}]

    resposta = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=mensagens,
        temperature=0.7,
        max_tokens=400
    )

    return resposta.choices[0].message.content


