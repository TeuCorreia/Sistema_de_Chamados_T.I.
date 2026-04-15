from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_conn():
    return psycopg2.connect(
        host="localhost",
        database="chamados_ti",
        user="postgres",
        password=os.getenv("DB_PASSWORD")
    )

class ClienteInput(BaseModel):
    nome: str
    setor: str

class ChamadoInput(BaseModel):
    descricao: str
    cliente_id: int

class LoginInput(BaseModel):
    login: str
    senha: str

@app.get("/")
def home():
    return {"mensagem": "API de Chamados T.I. funcionando!"}

@app.get("/clientes")
def listar_clientes():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, setor FROM clientes ORDER BY nome")
    clientes = cursor.fetchall()
    conn.close()
    return [{"id": c[0], "nome": c[1], "setor": c[2]} for c in clientes]

@app.post("/clientes")
def cadastrar_cliente(cliente: ClienteInput):
    conn = get_conn()  
    cursor = conn.cursor()
    cursor.execute("INSERT INTO clientes (nome, setor) VALUES (%s, %s)", (cliente.nome, cliente.setor))
    conn.commit()
    conn.close()
    return {"mensagem": f"Cliente {cliente.nome} cadastrado com sucesso!"}

@app.get("/chamados")
def listar_chamados():
    conn = get_conn()  
    cursor = conn.cursor()
    cursor.execute("""
        SELECT chamados.id, clientes.nome, chamados.descricao, chamados.status, chamados.aberto_em
        FROM chamados
        JOIN clientes ON chamados.cliente_id = clientes.id
        ORDER BY chamados.aberto_em DESC
    """)
    chamados = cursor.fetchall()
    conn.close()
    return [{"id": c[0], "cliente": c[1], "descricao": c[2], "status": c[3], "aberto_em": c[4]} for c in chamados]

@app.post("/chamados")
def abrir_chamado(chamado: ChamadoInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chamados (descricao, cliente_id) VALUES (%s, %s)", (chamado.descricao, chamado.cliente_id))
    conn.commit()
    conn.close()
    return {"mensagem": "Chamado aberto com sucesso!"}


@app.post("/login")
def login(dados: LoginInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT nome, senha FROM usuarios WHERE login = %s", (dados.login,))
    usuario = cursor.fetchone()
    conn.close()
    if usuario and bcrypt.checkpw(dados.senha.encode("utf-8"), usuario[1].encode("utf-8")):
        return {"nome": usuario[0]}
    from fastapi import HTTPException
    raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

@app.put("/chamados/{id}/fechar")
def fechar_chamado(id: int):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("UPDATE chamados SET status = 'Fechado' WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return {"mensagem": f"Chamado {id} fechado com sucesso!"}

@app.delete("/chamados/{id}")
def deletar_chamado(id: int):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chamados WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return {"mensagem": f"Chamado {id} deletado com sucesso!"}



#http://127.0.0.1:8000/docs#/