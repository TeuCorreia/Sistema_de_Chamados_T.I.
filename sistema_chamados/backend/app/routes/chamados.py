from fastapi import APIRouter, HTTPException
from app.database import get_conn
from app.schemas import ChamadoInput, FecharChamadoInput

router = APIRouter(prefix="/chamados", tags=["Chamados"])

@router.get("/")
def listar_chamados(user_id: int | None = None, admin: bool = False):
    conn = get_conn()
    cursor = conn.cursor()

    if admin:
        cursor.execute("""
            SELECT c.id, cl.nome, c.descricao, c.status, c.aberto_em, c.cliente_id, c.usuario_id, u.nome
            FROM chamados c
            JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            ORDER BY c.aberto_em DESC
        """)
    elif user_id is not None:
        cursor.execute("""
            SELECT c.id, cl.nome, c.descricao, c.status, c.aberto_em, c.cliente_id, c.usuario_id, u.nome
            FROM chamados c
            JOIN clientes cl ON c.cliente_id = cl.id
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.usuario_id = %s
            ORDER BY c.aberto_em DESC
        """, (user_id,))
    else:
        conn.close()
        return []

    chamados = cursor.fetchall()
    conn.close()
    return [
        {
            "id": c[0],
            "cliente": c[1],
            "descricao": c[2],
            "status": c[3],
            "aberto_em": c[4],
            "cliente_id": c[5],
            "usuario_id": c[6],
            "usuario_nome": c[7] or ""
        }
        for c in chamados
    ]

@router.post("/")
def abrir_chamado(chamado: ChamadoInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO chamados (descricao, cliente_id, usuario_id) VALUES (%s, %s, %s)",
        (chamado.descricao, chamado.cliente_id, chamado.usuario_id)
    )
    conn.commit()
    conn.close()
    return {"mensagem": "Chamado aberto com sucesso!"}

@router.put("/{id}/fechar")
def fechar_chamado(id: int, dados: FecharChamadoInput):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT usuario_id FROM chamados WHERE id = %s", (id,))
    chamado = cursor.fetchone()
    if not chamado:
        conn.close()
        raise HTTPException(status_code=404, detail="Chamado não encontrado")

    dono_id = chamado[0]
    if not dados.is_admin and dono_id != dados.user_id:
        conn.close()
        raise HTTPException(status_code=403, detail="Você não tem permissão para fechar este chamado")

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