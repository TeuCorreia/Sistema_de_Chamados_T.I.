from fastapi import APIRouter, HTTPException
from app.database import get_conn
from app.schemas import ChamadoInput

router = APIRouter(prefix="/chamados", tags=["Chamados"])

@router.get("/")
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

@router.post("/")
def abrir_chamado(chamado: ChamadoInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chamados (descricao, cliente_id) VALUES (%s, %s)", (chamado.descricao, chamado.cliente_id))
    conn.commit()
    conn.close()
    return {"mensagem": "Chamado aberto com sucesso!"}

@router.put("/{id}/fechar")
def fechar_chamado(id: int):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("UPDATE chamados SET status = 'Fechado' WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return {"mensagem": f"Chamado {id} fechado com sucesso!"}

@router.delete("/{id}")
def deletar_chamado(id: int):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chamados WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return {"mensagem": f"Chamado {id} deletado com sucesso!"}