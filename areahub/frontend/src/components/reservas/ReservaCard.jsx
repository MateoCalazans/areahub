export default function ReservaCard({ reserva, onApprove, onReject }) {
  const {
    area,
    usuario,
    data,
    horaInicio,
    horaFim,
    status,
    motivo,
  } = reserva;

  const statusLabel = String(status || 'PENDENTE').toUpperCase();

  return (
    <article className="mb-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{area?.nome || 'Área'}</h2>
          <p className="text-sm text-slate-600">{usuario?.nome || usuario?.name || 'Usuário desconhecido'}</p>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          statusLabel === 'APROVADA'
            ? 'bg-emerald-100 text-emerald-700'
            : statusLabel === 'REJEITADA'
            ? 'bg-rose-100 text-rose-700'
            : statusLabel === 'PENDENTE'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-slate-100 text-slate-700'
        }`}>
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="text-sm text-slate-700"><strong>Data:</strong> {data}</p>
        <p className="text-sm text-slate-700"><strong>Horário:</strong> {horaInicio} - {horaFim}</p>
        {motivo && <p className="text-sm text-slate-700 sm:col-span-2"><strong>Motivo:</strong> {motivo}</p>}
      </div>

      {(onApprove || onReject) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {onApprove && (
            <button
              type="button"
              onClick={() => onApprove(reserva.id)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Aprovar
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={() => onReject(reserva.id)}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Rejeitar
            </button>
          )}
        </div>
      )}
    </article>
  );
}
