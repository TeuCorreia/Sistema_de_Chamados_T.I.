import revimagem from "../assets/logomarca_rev002.png"

function Sidebar({ usuario, menuAtivo, setMenuAtivo, setSidebarOpen, onLogout, setSelectedChamado }) {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-950 px-4 py-6">
      <div className="mb-8 px-3">
        <div className="mb-6 flex items-center justify-between gap-3 rounded-3xl bg-slate-900 px-4 py-5 shadow-sm shadow-black/20">
          <div className="flex items-center gap-3">
            <img src={revimagem} alt="Logo" className="h-10 w-10 object-contain" />
            <div>
              <p className="text-sm text-slate-400">Bem-vindo,</p>
              <p className="font-semibold">{usuario?.nome}</p>
              <p className="text-xs text-slate-500">{usuario?.role === "admin" ? "Administrador" : "Usuário"}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
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
            >
              <span>{item.label}</span>
              <span className="text-slate-500">›</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6 px-3">
        <button onClick={onLogout} className="w-full rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700">
          Sair
        </button>
      </div>
    </aside>
  )
}

export default Sidebar