import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import areaService from '../services/areaService';
import reservaService from '../services/reservaService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';

export default function AreaDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [area, setArea] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [areaRes, reservasRes] = await Promise.all([
          areaService.buscarPorId(id),
          reservaService.listar({ areaId: id, data: selectedDate }),
        ]);
        setArea(areaRes.area || areaRes);
        setReservas(reservasRes.reservas || reservasRes || []);
      } catch {
        setError('Falha ao carregar dados da area.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, selectedDate]);

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  if (error || !area) {
    return (
      <div className="rounded-xl bg-error-container p-4 text-sm text-on-error-container">
        {error || 'Area nao encontrada.'}
      </div>
    );
  }

  const areaId = area.id || area.id_area;
  const allReservas = Array.isArray(reservas) ? reservas : [];
  const reservasDoDia = allReservas.filter((r) => {
    const rAreaId = r.areaId || r.area_id || r.id_area || r.area?.id || r.area?.id_area;
    const rData = new Date(r.data).toISOString().split('T')[0];
    return String(rAreaId) === String(areaId) && rData === selectedDate && (r.status === 'APROVADA' || r.status === 'PENDENTE');
  });

  const abertura = area.horarioAbertura || area.horario_abertura || '08:00';
  const fechamento = area.horarioFechamento || area.horario_fechamento || '22:00';
  const startHour = parseInt(abertura.split(':')[0], 10);
  const endHour = parseInt(fechamento.split(':')[0], 10);

  const timeSlots = [];
  for (let h = startHour; h < endHour; h++) {
    const slotStart = `${String(h).padStart(2, '0')}:00`;
    const slotEnd = `${String(h + 1).padStart(2, '0')}:00`;
    const occupied = reservasDoDia.find((r) => {
      const rStart = parseInt((r.horaInicio || r.hora_inicio).split(':')[0], 10);
      const rEnd = parseInt((r.horaFim || r.hora_fim).split(':')[0], 10);
      return h >= rStart && h < rEnd;
    });
    timeSlots.push({ start: slotStart, end: slotEnd, occupied, hour: h });
  }

  return (
    <div>
      <Link to="/areas" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-container">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Voltar para areas
      </Link>

      <div className="mt-2 rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">{area.nome}</h2>
            {area.descricao && (
              <p className="mt-1 text-sm text-on-surface-variant">{area.descricao}</p>
            )}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              area.ativa ? 'bg-success-light text-success' : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {area.ativa ? 'Ativa' : 'Inativa'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">group</span>
            Capacidade: {area.capacidade} pessoas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">schedule</span>
            Horario: {abertura} - {fechamento}
          </span>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-6 rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-semibold text-on-surface">Disponibilidade</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {timeSlots.map((slot) => (
            <div
              key={slot.start}
              className={`flex items-center justify-between rounded-xl p-3 ${
                slot.occupied
                  ? 'bg-error-container/50'
                  : 'bg-success-light/50'
              }`}
            >
              <span className="text-sm font-medium text-on-surface">
                {slot.start} - {slot.end}
              </span>
              {slot.occupied ? (
                <StatusBadge status={slot.occupied.status} />
              ) : (
                <span className="text-xs font-medium text-success">Disponivel</span>
              )}
            </div>
          ))}
        </div>

        {user?.role === 'CONDOMINO' && area.ativa && (
          <div className="mt-6">
            <Link
              to={`/reservas/nova/${areaId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Fazer Reserva
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
