from pydantic import BaseModel

class ClienteInput(BaseModel):
    nome: str
    setor: str

class ChamadoInput(BaseModel):
    descricao: str
    cliente_id: int

class LoginInput(BaseModel):
    login: str
    senha: str