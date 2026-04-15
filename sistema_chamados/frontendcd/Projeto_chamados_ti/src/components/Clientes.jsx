import { useState, useEffect } from "react"
import axios from "axios"

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [nome, setNome] = useState("")
  const [setor, setSetor] = useState("")

  async function listar() {
    const res = await axios.get("http://127.0.0.1:8000/clientes")
    setClientes(res.data)
  }

  async function cadastrar() {
    if (!nome) return
    await axios.post("http://127.0.0.1:8000/clientes", { nome, setor })
    setNome("")
    setSetor("")
    listar()
  }

  useEffect(() => { listar() }, [])

  return (
    <div>
      <div className="bg-gray-800 p-5 rounded-xl mb-5 flex gap-3 items-end">
        <div>
          <label className="text-gray-400 text-sm">Nome</label>
          <input
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do cliente"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm">Setor</label>
          <input
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Setor"
            value={setor}
            onChange={e => setSetor(e.target.value)}
          />
        </div>
        <button
          onClick={cadastrar}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition"
        >
          Cadastrar
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Setor</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                <td className="px-4 py-3 text-gray-400">{c.id}</td>
                <td className="px-4 py-3">{c.nome}</td>
                <td className="px-4 py-3 text-gray-400">{c.setor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Clientes