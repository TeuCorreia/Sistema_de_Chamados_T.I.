function ChamadoList({ carregando, conteudoVisivel, menuAtivo, onSelectChamado }) {
  if (carregando) {
    return <div className="flex h-72 items-center justify-center text-slate-400">Carregando dados...</div>
  }

  if (conteudoVisivel.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-slate-400">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800 text-3xl">📭</div>
        <p className="text-lg font-semibold text-white">Nenhum chamado encontrado.</p>
        <p className="max-w-md text-sm text-slate-400">Crie um novo chamado para começar a acompanhar as solicitações.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {conteudoVisivel.map(c => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelectChamado(c)}
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
  )
}

export default ChamadoList
