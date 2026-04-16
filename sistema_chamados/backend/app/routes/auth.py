import bcrypt
from fastapi import APIRouter, HTTPException
from app.database import get_conn
from app.schemas import LoginInput

router = APIRouter(tags=["Autenticação"])

@router.get("/login")
def Listar_logins():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, login FROM usuarios ORDER BY id")
    usuarios = cursor.fetchall()
    conn.close()
    return [{"id": u[0], "nome": u[1], "login": u[2]} for u in usuarios]
    
@router.post("/login")
def login(dados: LoginInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT nome, senha FROM usuarios WHERE login = %s", (dados.login,))
    usuario = cursor.fetchone()
    conn.close()
    if usuario and bcrypt.checkpw(dados.senha.encode("utf-8"), usuario[1].encode("utf-8")):
        return {"nome": usuario[0]}
    raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")