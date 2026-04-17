function NovoChamadoModal({ clientes, clienteId, onChangeClienteId, descricao, onChangeDescricao, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="max-w-md w-full rounded-3xl bg-[#0F172A] border border-slate-800 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Novo Chamado</h2>
            <p className="mt-2 text-sm text-slate-400">Selecione o cliente e descreva o problema.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300">Solicitante</label>
            <select
              value={clienteId}
              onChange={onChangeClienteId}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            >
              <option value="" disabled>Selecione o solicitante do chamado</option>
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
              onChange={onChangeDescricao}
              placeholder="Descreva o problema..."
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <button
            onClick={onSubmit}
            className="w-full rounded-3xl bg-teal-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
            type="button"
          >
            + Abrir Chamado
          </button>
        </div>
      </div>
    </div>
  )
}

export default NovoChamadoModal
