import { useState } from "react"
import Clientes from "../components/Clientes"
import Chamados from "../components/Chamados"

function Dashboard({ usuario }) {
  const [aba, setAba] = useState("chamados")

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold text-blue-400">🖥️ Sistema de Chamados T.I.</h1>
        <span className="text-gray-400 text-sm">Olá, <span className="text-white font-semibold">{usuario}</span></span>
      </div>

      <div className="flex gap-2 px-6 pt-6">
        <button
          onClick={() => setAba("chamados")}
          className={`px-5 py-2 rounded-lg font-semibold transition ${aba === "chamados" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
        >
          🎫 Chamados
        </button>
        <button
          onClick={() => setAba("clientes")}
          className={`px-5 py-2 rounded-lg font-semibold transition ${aba === "clientes" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
        >
          👤 Clientes
        </button>
      </div>

      <div className="px-6 py-4">
        {aba === "chamados" ? <Chamados /> : <Clientes />}
      </div>
    </div>
  )
}

export default Dashboard