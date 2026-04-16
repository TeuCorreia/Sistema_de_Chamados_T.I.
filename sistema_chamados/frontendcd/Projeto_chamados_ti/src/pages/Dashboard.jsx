import { useState, useEffect } from "react"
import axios from "axios"

function Dashboard({ usuario, onLogout }) {
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [abrirModal, setAbrirModal] = useState(false)
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState("")
  const [descricao, setDescricao] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [perfilEmail, setPerfilEmail] = useState("ti@revestbem.com.br")
  const [perfilNome, setPerfilNome] = useState(usuario?.nome || "")
  const [menuAtivo, setMenuAtivo] = useState("abertos")
  const [selectedChamado, setSelectedChamado] = useState(null)
  const [chatMensagens, setChatMensagens] = useState({})
  const [mensagemChat, setMensagemChat] = useState("")

  const listarChamados = async () => {
    try {
      setCarregando(true)
      const res = await axios.get("http://127.0.0.1:8000/chamados", {
        params: {
          user_id: usuario?.id,
          admin: usuario?.role === "admin"
        }
      })
      setChamados(res.data)
    } catch (error) {
      console.error("Erro ao carregar chamados:", error)
    } finally {
      setCarregando(false)
    }
  }

  const listarClientes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/clientes")
      setClientes(res.data)
      if (res.data.length > 0) setClienteId(res.data[0].id)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    }
  }

  const abrirNovoChamado = async () => {
    if (!clienteId || !descricao.trim()) return
    try {
      await axios.post("http://127.0.0.1:8000/chamados", {
        descricao: descricao.trim(),
        cliente_id: parseInt(clienteId, 10),
        usuario_id: usuario?.id
      })
      setDescricao("")
      setAbrirModal(false)
      listarChamados()
    } catch (error) {
      console.error("Erro ao abrir chamado:", error)
    }
  }

  const salvarPerfil = () => {
    console.log("Perfil salvo", { perfilEmail, perfilNome })
  }

  const fecharChamado = async () => {
    if (!selectedChamado) return
    try {
      await axios.put(`http://127.0.0.1:8000/chamados/${selectedChamado.id}/fechar`, {
        user_id: usuario?.id,
        is_admin: usuario?.role === "admin"
      })
      listarChamados()
      setSelectedChamado(prev => prev ? { ...prev, status: "Fechado" } : prev)
    } catch (error) {
      console.error("Erro ao fechar chamado:", error)
    }
  }

  useEffect(() => {
    listarChamados()
    listarClientes()
  }, [])

  const chamadosAbertos = chamados.filter(c => c.status === "aberto")
  const chamadosResolvidos = chamados.filter(c => c.status !== "aberto")
  const conteudoVisivel = menuAtivo === "resolvidos" ? chamadosResolvidos : chamadosAbertos
  const exibindoDetalhe = Boolean(selectedChamado)
  const titulo = exibindoDetalhe ? "Detalhes do Chamado" : (menuAtivo === "resolvidos" ? "Chamados Resolvidos" : "Chamados Abertos")
  const descricaoTitulo = exibindoDetalhe
    ? "Velas e chat do chamado selecionado."
    : menuAtivo === "resolvidos"
      ? "Veja os chamados que já foram finalizados."
      : "Tela principal de chamados após o login."

  const voltarLista = () => setSelectedChamado(null)
  const canCloseChamado = selectedChamado && (usuario?.role === "admin" || selectedChamado?.usuario_id === usuario?.id)

  const enviarMensagem = () => {
    if (!mensagemChat.trim() || !selectedChamado) return
    setChatMensagens(prev => {
      const mensagensAtuais = prev[selectedChamado.id] || []
      return {
        ...prev,
        [selectedChamado.id]: [
          ...mensagensAtuais,
          {
            id: Date.now(),
            autor: usuario?.nome || "Você",
            texto: mensagemChat.trim(),
            horario: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          }
        ]
      }
    })
    setMensagemChat("")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <aside className="w-72 border-r border-slate-800 bg-slate-950 px-4 py-6">
            <div className="mb-8 px-3">
              <div className="mb-6 flex items-center justify-between gap-3 rounded-3xl bg-slate-900 px-4 py-5 shadow-sm shadow-black/20">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-3xl bg-teal-500 flex items-center justify-center text-xl font-bold text-slate-950">R</div>
                  <div>
                    <p className="text-sm text-slate-400">Bem-vindo,</p>
                    <p className="font-semibold">{usuario?.nome}</p>
                    <p className="text-xs text-slate-500">{usuario?.role === "admin" ? "Administrador" : "Usuário"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
                  type="button"
                >
                  ‹
                </button>
              </div>
              <nav className="space-y-2 text-sm">
                {[
                  { key: "abertos", label: "Chamados Abertos" },
                  { key: "resolvidos", label: "Resolvidos" },
                  { key: "configuracoes", label: "Configurações" }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setMenuAtivo(item.key)
                      setSelectedChamado(null)
                    }}
                    className={`flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left transition ${menuAtivo === item.key ? "bg-slate-800 text-white shadow-md shadow-black/20" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
                    type="button"
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-500">›</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-6 px-3">
              <button
                onClick={onLogout}
                className="w-full rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                type="button"
              >
                Sair
              </button>
            </div>
            <div className="mt-4 px-3 text-xs text-slate-500">© TI Revestbem</div>
          </aside>
        )}

        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                  type="button"
                >
                  Abrir opções
                </button>
              )}
              <div>
                <h1 className="text-3xl font-semibold text-white">{titulo}</h1>
                <p className="text-gray-400 text-sm mt-1">{descricaoTitulo}</p>
              </div>
            </div>
            {!exibindoDetalhe && (
              <button
                onClick={() => setAbrirModal(true)}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                type="button"
              >
                + Novo Chamado
              </button>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-sm shadow-black/20 min-h-[320px]">
            {exibindoDetalhe ? (
              <div className="space-y-6">
                <button
                  onClick={voltarLista}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
                  type="button"
                >
                  ← Voltar
                </button>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-sm shadow-black/10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Chamado #{selectedChamado.id}</p>
                        <h2 className="text-3xl font-semibold text-white">{selectedChamado.descricao}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${selectedChamado.status === "aberto" ? "bg-yellow-500/15 text-yellow-300" : "bg-teal-500/15 text-teal-300"}`}>
                          {selectedChamado.status}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-slate-300">{selectedChamado.descricao}</p>
                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>Cliente: {selectedChamado.cliente}</span>
                      <span>Criado por: {selectedChamado.usuario_nome || "Desconhecido"}</span>
                      <span>Criado em: {new Date(selectedChamado.aberto_em).toLocaleString("pt-BR")}</span>
                    </div>
                    {canCloseChamado && selectedChamado.status !== "Fechado" && (
                      <button
                        onClick={fecharChamado}
                        className="mt-5 rounded-3xl bg-teal-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
                        type="button"
                      >
                        Fechar Chamado
                      </button>
                    )}
                    {!canCloseChamado && selectedChamado.status !== "Fechado" && (
                      <div className="mt-5 text-sm text-slate-400">Você só pode fechar seus próprios chamados.</div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-sm shadow-black/10">
                    <h3 className="text-xl font-semibold text-white">Chat do Chamado</h3>
                    <div className="mt-5 min-h-[200px] rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
                      {(chatMensagens[selectedChamado.id] || []).length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center text-slate-500">Nenhuma mensagem ainda. Seja o primeiro a comentar!</div>
                      ) : (
                        <div className="space-y-4">
                          {(chatMensagens[selectedChamado.id] || []).map(msg => (
                            <div key={msg.id} className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{msg.autor}</span>
                                <span>{msg.horario}</span>
                              </div>
                              <p className="text-sm text-slate-200">{msg.texto}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex gap-3">
                      <input
                        value={mensagemChat}
                        onChange={e => setMensagemChat(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                      />
                      <button
                        onClick={enviarMensagem}
                        className="rounded-3xl bg-teal-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
                        type="button"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : menuAtivo === "configuracoes" ? (
              <div className="mx-auto max-w-xl">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-sm shadow-black/10">
                  <h2 className="text-2xl font-semibold text-white">Configurações</h2>
                  <p className="text-sm text-slate-400 mt-2">Atualize seus dados de perfil abaixo.</p>
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      salvarPerfil()
                    }}
                    className="mt-8 space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Email</label>
                      <input
                        type="email"
                        value={perfilEmail}
                        onChange={e => setPerfilEmail(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Nome</label>
                      <input
                        type="text"
                        value={perfilNome}
                        onChange={e => setPerfilNome(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                    >
                      Salvar
                    </button>
                  </form>
                </div>
              </div>
            ) : carregando ? (
              <div className="flex h-72 items-center justify-center text-slate-400">Carregando dados...</div>
            ) : conteudoVisivel.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-slate-400">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800 text-3xl">📭</div>
                <p className="text-lg font-semibold text-white">Nenhum chamado encontrado.</p>
                <p className="max-w-md text-sm text-slate-400">Crie um novo chamado para começar a acompanhar as solicitações.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conteudoVisivel.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedChamado(c)}
                    className="w-full text-left rounded-3xl border border-slate-700 bg-slate-950 p-5 shadow-sm shadow-black/10 transition hover:border-teal-400"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Chamado #{c.id}</p>
                        <p className="text-lg font-semibold text-white">{c.descricao}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${menuAtivo === "resolvidos" ? "bg-teal-500/15 text-teal-300" : "bg-yellow-500/15 text-yellow-300"}`}>
                        {menuAtivo === "resolvidos" ? "resolvido" : "aberto"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>Cliente: {c.cliente}</span>
                      <span>Aberto em: {new Date(c.aberto_em).toLocaleString("pt-BR")}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {abrirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setAbrirModal(false)}>
          <div className="max-w-md w-full rounded-3xl bg-[#0F172A] border border-slate-800 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Novo Chamado</h2>
                <p className="mt-2 text-sm text-slate-400">Selecione o cliente e descreva o problema.</p>
              </div>
              <button
                type="button"
                onClick={() => setAbrirModal(false)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300">Cliente</label>
                <select
                  value={clienteId}
                  onChange={e => setClienteId(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                >
                  <option value="" disabled>Selecione um cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Descrição</label>
                <textarea
                  rows={5}
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Descreva o problema..."
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <button
                onClick={abrirNovoChamado}
                className="w-full rounded-3xl bg-teal-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
                type="button"
              >
                + Abrir Chamado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard