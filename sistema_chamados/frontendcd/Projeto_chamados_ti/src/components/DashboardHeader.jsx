function DashboardHeader({ titulo, descricaoTitulo, exibindoDetalhe, sidebarOpen, onOpenSidebar, onOpenChamadoModal, onOpenClienteModal }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onOpenClienteModal}
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            type="button"
          >
            + Incluir Solicitante
          </button>
          <button
            onClick={onOpenChamadoModal}
            className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            type="button"
          >
            + Novo Chamado
          </button>
        </div>
      )}
    </div>
  )
}

export default DashboardHeader
