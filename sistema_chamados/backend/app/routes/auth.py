import bcrypt
from fastapi import APIRouter, HTTPException
from app.database import get_conn
from app.schemas import LoginInput, RegisterInput

router = APIRouter(tags=["Autenticação"])

@router.get("/login")
def Listar_logins():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, login, role FROM usuarios ORDER BY id")
    usuarios = cursor.fetchall()
    conn.close()
    return [{"id": u[0], "nome": u[1], "login": u[2], "role": u[3]} for u in usuarios]
    
@router.post("/register")
def register(dados: RegisterInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM usuarios WHERE login = %s", (dados.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    hashed = bcrypt.hashpw(dados.senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    cursor.execute(
        "INSERT INTO usuarios (nome, login, senha, role) VALUES (%s, %s, %s, %s) RETURNING id",
        (dados.nome, dados.email, hashed, "user")
    )
    usuario_id = cursor.fetchone()[0]
    cursor.execute("INSERT INTO clientes (nome, setor) VALUES (%s, %s)", (dados.nome, "cliente"))
    conn.commit()
    conn.close()

    return {"id": usuario_id, "nome": dados.nome, "login": dados.email, "role": "user"}

@router.post("/login")
def login(dados: LoginInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, senha, role FROM usuarios WHERE login = %s", (dados.login,))
    usuario = cursor.fetchone()
    conn.close()
    if usuario and bcrypt.checkpw(dados.senha.encode("utf-8"), usuario[2].encode("utf-8")):
        return {"id": usuario[0], "nome": usuario[1], "login": dados.login, "role": usuario[3]}
    raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")