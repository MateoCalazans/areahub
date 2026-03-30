import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reservaService from '../services/reservaService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function MinhasReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReservas() {
      try {
        const response = await reservaService.listar();
        setReservas(response.reservas || response || []);
      } catch {
        setError('Falha ao carregar suas reservas.');
      } finally {
        setLoading(false);
      }
    }
    fetchReservas();
  }, []);

  const handleCancelar = async (id) => {
    if (!window.confirm('Deseja realmente cancelar esta reserva?')) return;
    try {
      await reservaService.cancelar(id);
      setReservas((prev) =>
        prev.map((r) =>
          (r.id || r.id_reserva) === id ? { ...r, status: 'CANCELADA' } : r
        )
      );
    } catch {
      setError('Falha ao cancelar reserva.');
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const reservasList = Array.isArray(reservas) ? reservas : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Minhas Reservas</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Acompanhe suas reservas de areas comuns</p>
        </div>
        <Link
          to="/reservas/nova"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nova Reserva
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {reservasList.length === 0 ? (
        <EmptyState
          icon="event_busy"
          message="Nenhuma reserva encontrada"
          description="Faca sua primeira reserva clicando no botao acima"
        />
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Area</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Horario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {reservasList.map((r) => {
                const rid = r.id || r.id_reserva;
                return (
                  <tr key={rid} className="transition-colors hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 text-sm font-medium text-on-surface">
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
                        <button
                          onClick={() => handleCancelar(rid)}
                          className="flex items-center gap-1 rounded-lg bg-error-container px-2.5 py-1 text-xs font-medium text-on-error-container transition-colors hover:bg-error hover:text-on-error"
                        >
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
