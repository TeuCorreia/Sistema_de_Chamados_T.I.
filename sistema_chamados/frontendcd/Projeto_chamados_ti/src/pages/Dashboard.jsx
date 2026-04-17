import { useState, useEffect } from "react"
import api from "../services/api"
import Sidebar from "../components/Sidebar"
import DashboardHeader from "../components/DashboardHeader"
import ChamadoDetail from "../components/ChamadoDetail"
import ChamadoList from "../components/ChamadoList"
import NovoChamadoModal from "../components/NovoChamadoModal"
import NovoClienteModal from "../components/NovoClienteModal"

function Dashboard({ usuario, onLogout }) {
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [abrirModal, setAbrirModal] = useState(false)
  const [abrirModalCliente, setAbrirModalCliente] = useState(false)
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState("")
  const [descricao, setDescricao] = useState("")
  const [nomeCliente, setNomeCliente] = useState("")
  const [setorCliente, setSetorCliente] = useState("")
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
      const res = await api.get("/chamados", {
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
      const res = await api.get("/clientes")
      setClientes(res.data)
      if (res.data.length > 0) setClienteId(res.data[0].id)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    }
  }

  const abrirNovoChamado = async () => {
    if (!clienteId || !descricao.trim()) return
    try {
      await api.post("/chamados", {
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

  const cadastrarCliente = async () => {
    if (!nomeCliente.trim()) return
    try {
      await api.post("/clientes", {
        nome: nomeCliente.trim(),
        setor: setorCliente.trim()
      })
      setNomeCliente("")
      setSetorCliente("")
      setAbrirModalCliente(false)
      listarClientes()
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error)
    }
  }

  const salvarPerfil = () => {
    console.log("Perfil salvo", { perfilEmail, perfilNome })
  }

  const fecharChamado = async () => {
    if (!selectedChamado) return
    try {
      await api.put(`/chamados/${selectedChamado.id}/fechar`, {
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
          <Sidebar 
            usuario={usuario}
            menuAtivo={menuAtivo}
            setMenuAtivo={setMenuAtivo}
            setSidebarOpen={setSidebarOpen}
            onLogout={onLogout}
            setSelectedChamado={setSelectedChamado}
          />
        )}

        <main className="flex-1 p-6">
          <DashboardHeader
            titulo={titulo}
            descricaoTitulo={descricaoTitulo}
            exibindoDetalhe={exibindoDetalhe}
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenChamadoModal={() => setAbrirModal(true)}
            onOpenClienteModal={() => setAbrirModalCliente(true)}
          />

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-sm shadow-black/20 min-h-[320px]">
            {exibindoDetalhe ? (
              <ChamadoDetail
                selectedChamado={selectedChamado}
                onBack={voltarLista}
                canCloseChamado={canCloseChamado}
                onFecharChamado={fecharChamado}
                chatMensagens={chatMensagens}
                mensagemChat={mensagemChat}
                onChangeMensagemChat={e => setMensagemChat(e.target.value)}
                onEnviarMensagem={enviarMensagem}
              />
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
            ) : (
              <ChamadoList
                carregando={carregando}
                conteudoVisivel={conteudoVisivel}
                menuAtivo={menuAtivo}
                onSelectChamado={setSelectedChamado}
              />
            )}
          </div>
        </main>
      </div>

      {abrirModal && (
        <NovoChamadoModal
          clientes={clientes}
          clienteId={clienteId}
          onChangeClienteId={e => setClienteId(e.target.value)}
          descricao={descricao}
          onChangeDescricao={e => setDescricao(e.target.value)}
          onClose={() => setAbrirModal(false)}
          onSubmit={abrirNovoChamado}
        />
      )}

      {abrirModalCliente && (
        <NovoClienteModal
          nomeCliente={nomeCliente}
          setorCliente={setorCliente}
          onChangeNome={e => setNomeCliente(e.target.value)}
          onChangeSetor={e => setSetorCliente(e.target.value)}
          onClose={() => setAbrirModalCliente(false)}
          onSubmit={cadastrarCliente}
        />
      )}
    </div>
  )
}

export default Dashboard