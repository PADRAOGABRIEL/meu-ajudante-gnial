contextos = {}

def get_context(clinica_id, paciente_id):
    return contextos.get(clinica_id, {}).get(paciente_id, [])

def save_context(clinica_id, paciente_id, contexto):
    if clinica_id not in contextos:
        contextos[clinica_id] = {}
    contextos[clinica_id][paciente_id] = contexto[-10:]  # mantém últimas 10 trocas
