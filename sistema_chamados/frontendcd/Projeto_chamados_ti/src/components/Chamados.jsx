import { useState, useEffect } from "react"
import axios from "axios"

function Chamados() {
  const [chamados, setChamados] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState("")
  const [descricao, setDescricao] = useState("")

  async function listar() {
    const res = await axios.get("http://127.0.0.1:8000/chamados")
    setChamados(res.data)
  }

  async function listarClientes() {
    const res = await axios.get("http://127.0.0.1:8000/clientes")
    setClientes(res.data)
    if (res.data.length > 0) setClienteId(res.data[0].id)
  }

  async function abrir() {
    if (!descricao || !clienteId) return
    await axios.post("http://127.0.0.1:8000/chamados", {
      descricao,
      cliente_id: parseInt(clienteId)
    })
    setDescricao("")
    listar()
  }

  async function fechar(id) {
    await axios.put(`http://127.0.0.1:8000/chamados/${id}/fechar`)
    listar()
  }

  async function deletar(id) {
    await axios.delete(`http://127.0.0.1:8000/chamados/${id}`)
    listar()
  }

  useEffect(() => {
    listar()
    listarClientes()
  }, [])

  return (
    <div>
      <div className="bg-gray-800 p-5 rounded-xl mb-5 flex gap-3 items-end">
        <div>
          <label className="text-gray-400 text-sm">Cliente</label>
          <select
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
          >
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-gray-400 text-sm">Descrição</label>
          <input
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o chamado"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
        </div>
        <button
          onClick={abrir}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition"
        >
          Abrir chamado
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {chamados.map(c => (
              <tr key={c.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                <td className="px-4 py-3 text-gray-400">{c.id}</td>
                <td className="px-4 py-3">{c.cliente}</td>
                <td className="px-4 py-3">{c.descricao}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === "aberto" ? "bg-green-700 text-green-200" : "bg-gray-600 text-gray-300"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(c.aberto_em).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 flex gap-2">
                  {c.status === "aberto" && (
                    <button
                      onClick={() => fechar(c.id)}
                      className="bg-green-700 hover:bg-green-800 text-white text-xs px-3 py-1 rounded-lg transition"
                    >
                      Fechar
                    </button>
                  )}
                  <button
                    onClick={() => deletar(c.id)}
                    className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 rounded-lg transition"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Chamados