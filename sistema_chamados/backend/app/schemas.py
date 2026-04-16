from pydantic import BaseModel

class ClienteInput(BaseModel):
    nome: str
    setor: str

class ChamadoInput(BaseModel):
    descricao: str
    cliente_id: int
    usuario_id: int | None = None

class FecharChamadoInput(BaseModel):
    user_id: int
    is_admin: bool

class LoginInput(BaseModel):
    login: str
    senha: str

class RegisterInput(BaseModel):
    nome: str
    email: str
    senha: str