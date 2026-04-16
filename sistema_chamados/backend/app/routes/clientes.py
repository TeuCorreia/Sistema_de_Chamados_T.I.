from fastapi import APIRouter
from app.database import get_conn
from app.schemas import ClienteInput

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.get("/")
def listar_clientes():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, setor FROM clientes ORDER BY nome")
    clientes = cursor.fetchall()
    conn.close()
    return [{"id": c[0], "nome": c[1], "setor": c[2]} for c in clientes]

@router.post("/")
def cadastrar_cliente(cliente: ClienteInput):
    conn = get_conn()  
    cursor = conn.cursor()
    cursor.execute("INSERT INTO clientes (nome, setor) VALUES (%s, %s)", (cliente.nome, cliente.setor))
    conn.commit()
    conn.close()
    return {"mensagem": f"Cliente {cliente.nome} cadastrado com sucesso!"}

@router.delete("/{id}")
def deletar_cliente(id: int):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clientes WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return {"mensagem": f"Cliente {id} deletado com sucesso!"}