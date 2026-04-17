function ChamadoDetail({ selectedChamado, onBack, canCloseChamado, onFecharChamado, chatMensagens, mensagemChat, onChangeMensagemChat, onEnviarMensagem }) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
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
              onClick={onFecharChamado}
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
              onChange={onChangeMensagemChat}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            />
            <button
              onClick={onEnviarMensagem}
              className="rounded-3xl bg-teal-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
              type="button"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChamadoDetail
