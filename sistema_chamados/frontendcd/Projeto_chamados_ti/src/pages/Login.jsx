import { useState } from "react"
import axios from "axios"

function Login({ onLogin }) {
  const [login, setLogin] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  async function handleLogin() {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        login,
        senha
      })
      onLogin(response.data.nome)
    } catch (e) {
      setErro("Usuário ou senha incorretos!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl w-96 shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-2">🖥️ Sistema de Chamados</h1>
        <p className="text-gray-400 text-center text-sm mb-6">Faça login para continuar</p>

        <label className="text-gray-300 text-sm">Usuário</label>
        <input
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite seu usuário"
          value={login}
          onChange={e => setLogin(e.target.value)}
        />

        <label className="text-gray-300 text-sm">Senha</label>
        <input
          type="password"
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        {erro && <p className="text-red-400 text-sm mb-3">{erro}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
        >
          Entrar
        </button>

        <p className="text-gray-600 text-xs text-center mt-6">T.I. System v1.0</p>
      </div>
    </div>
  )
}

export default Login