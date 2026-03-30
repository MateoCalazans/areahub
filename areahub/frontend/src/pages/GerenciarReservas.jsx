import { useState, useEffect } from 'react';
import reservaService from '../services/reservaService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function GerenciarReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchReservas();
  }, []);

  async function fetchReservas() {
    setLoading(true);
    try {
      const response = await reservaService.listar();
      setReservas(response.reservas || response || []);
    } catch {
      setError('Falha ao carregar reservas.');
    } finally {
      setLoading(false);
    }
  }

  const handleAprovar = async (id) => {
    try {
      await reservaService.aprovar(id);
      setReservas((prev) =>
        prev.map((r) => ((r.id || r.id_reserva) === id ? { ...r, status: 'APROVADA' } : r))
      );
    } catch {
      setError('Falha ao aprovar reserva.');
    }
  };

  const handleRejeitar = async (id) => {
    try {
      await reservaService.rejeitar(id, 'Rejeitada pela administracao');
      setReservas((prev) =>
        prev.map((r) => ((r.id || r.id_reserva) === id ? { ...r, status: 'REJEITADA' } : r))
      );
    } catch {
      setError('Falha ao rejeitar reserva.');
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const allReservas = Array.isArray(reservas) ? reservas : [];
  const filtered = filterStatus
    ? allReservas.filter((r) => r.status === filterStatus)
    : allReservas;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Gerenciar Reservas</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Aprove ou rejeite reservas dos condominos</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm font-medium text-on-surface">Filtrar por status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl bg-surface-container-lowest px-3 py-2 text-sm text-on-surface shadow-ambient outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADA">Aprovada</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="REJEITADA">Rejeitada</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="event_busy" message="Nenhuma reserva encontrada" description="Nao ha reservas com o filtro selecionado" />
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Condomino</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Unidade</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Horario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map((r) => {
                  const rid = r.id || r.id_reserva;
                  return (
                    <tr key={rid} className="transition-colors hover:bg-surface-container-low/50">
                      <td className="px-4 py-3 text-sm font-medium text-on-surface">
                        {r.condomino?.usuario?.nome || 'Condomino'}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">
                        {r.condomino?.unidade || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">
                        {r.area?.nome || 'Area'}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">
                        {new Date(r.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">
                        {r.horaInicio || r.hora_inicio} - {r.horaFim || r.hora_fim}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        {r.status === 'PENDENTE' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAprovar(rid)}
                              className="flex items-center gap-1 rounded-lg bg-success-light px-2.5 py-1 text-xs font-medium text-success transition-colors hover:bg-success hover:text-on-error"
                              title="Aprovar"
                            >
                              <span className="material-symbols-outlined text-sm">check</span>
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleRejeitar(rid)}
                              className="flex items-center gap-1 rounded-lg bg-error-container px-2.5 py-1 text-xs font-medium text-on-error-container transition-colors hover:bg-error hover:text-on-error"
                              title="Rejeitar"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
