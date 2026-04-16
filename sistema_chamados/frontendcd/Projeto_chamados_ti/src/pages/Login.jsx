import { useState } from "react"
import axios from "axios"

function Login({ onLogin }) {
  const [modoCadastro, setModoCadastro] = useState(false)
  const [nome, setNome] = useState("")
  const [login, setLogin] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  async function handleLogin() {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        login,
        senha
      })
      onLogin(response.data)
    } catch (e) {
      setErro("Usuário ou senha incorretos!")
      setSucesso("")
    }
  }

  async function handleRegister() {
    try {
      const response = await axios.post("http://127.0.0.1:8000/register", {
        nome,
        email: login,
        senha
      })
      onLogin(response.data)
    } catch (e) {
      setErro(e.response?.data?.detail || "Erro ao cadastrar usuário")
      setSucesso("")
    }
  }

  return (
    <div className="relative min-h-screen bg-[#06111f] text-white flex items-center justify-center px-4 py-8 overflow-hidden">
      <div className="pointer-events-none absolute left-[-120px] top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-100px] bottom-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-950/90 border border-slate-800/80 shadow-2xl shadow-cyan-500/10 rounded-[28px] px-8 py-10 backdrop-blur-xl">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 text-2xl">
            🖥️
          </div>

          <h1 className="text-3xl font-semibold text-white text-center">{modoCadastro ? "Cadastrar" : "Chamados T.I."}</h1>
          <p className="mt-2 text-center text-sm text-slate-400">{modoCadastro ? "Crie sua conta para abrir chamados" : "Sistema de Gestão de Chamados"}</p>

          <div className="mt-8 space-y-5">
            {modoCadastro && (
              <>
                <label className="block text-sm font-medium text-slate-300">Nome</label>
                <input
                  className="w-full rounded-2xl border border-slate-800/90 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </>
            )}

            <label className="block text-sm font-medium text-slate-300">{modoCadastro ? "Email" : "Usuário"}</label>
            <input
              className="w-full rounded-2xl border border-slate-800/90 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder={modoCadastro ? "seu@email.com" : "Informe seu usuário"}
              value={login}
              onChange={e => setLogin(e.target.value)}
            />

            <label className="block text-sm font-medium text-slate-300">Senha</label>
            <input
              type="password"
              className="w-full rounded-2xl border border-slate-800/90 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder={modoCadastro ? "Mínimo 8 caracteres" : "Informe sua senha"}
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>

          {(erro || sucesso) && (
            <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${erro ? "bg-red-500/10 border border-red-500 text-red-200" : "bg-emerald-500/10 border border-emerald-500 text-emerald-200"}`}>
              {erro || sucesso}
            </div>
          )}

          <button
            onClick={modoCadastro ? handleRegister : handleLogin}
            className="mt-8 w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-cyan-300"
          >
            {modoCadastro ? "Cadastrar" : "Entrar"}
          </button>

          <div className="mt-4 text-center text-sm text-slate-400">
            {modoCadastro ? (
              <>
                Já tem conta?{' '}
                <button
                  onClick={() => {
                    setModoCadastro(false)
                    setErro("")
                    setSucesso("")
                  }}
                  className="font-semibold text-white hover:text-cyan-300"
                  type="button"
                >
                  Entrar
                </button>
              </>
            ) : (
              <>
                Ainda não tem conta?{' '}
                <button
                  onClick={() => {
                    setModoCadastro(true)
                    setErro("")
                    setSucesso("")
                  }}
                  className="font-semibold text-white hover:text-cyan-300"
                  type="button"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">T.I. System v1.0</p>
        </div>
      </div>
    </div>
  )
}

export default Login