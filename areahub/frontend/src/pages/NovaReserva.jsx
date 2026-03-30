import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import areaService from '../services/areaService';
import reservaService from '../services/reservaService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function NovaReserva() {
  const { areaId: paramAreaId } = useParams();
  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(paramAreaId || '');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [reservasDia, setReservasDia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchAreas() {
      try {
        const response = await areaService.listar();
        const list = response.areas || response || [];
        setAreas(Array.isArray(list) ? list.filter((a) => a.ativa) : []);
      } catch {
        setError('Falha ao carregar areas.');
      } finally {
        setLoading(false);
      }
    }
    fetchAreas();
  }, []);

  useEffect(() => {
    if (!selectedAreaId || !data) {
      setReservasDia([]);
      return;
    }
    async function fetchReservas() {
      try {
        const response = await reservaService.listar({ areaId: selectedAreaId, data });
        const all = response.reservas || response || [];
        setReservasDia(Array.isArray(all) ? all : []);
      } catch {
        setReservasDia([]);
      }
    }
    fetchReservas();
  }, [selectedAreaId, data]);

  const selectedArea = areas.find(
    (a) => String(a.id || a.id_area) === String(selectedAreaId)
  );

  const getTimeOptions = () => {
    if (!selectedArea) return [];
    const abertura = selectedArea.horarioAbertura || selectedArea.horario_abertura || '08:00';
    const fechamento = selectedArea.horarioFechamento || selectedArea.horario_fechamento || '22:00';
    const start = parseInt(abertura.split(':')[0], 10);
    const end = parseInt(fechamento.split(':')[0], 10);
    const options = [];
    for (let h = start; h <= end; h++) {
      options.push(`${String(h).padStart(2, '0')}:00`);
    }
    return options;
  };

  const hasConflict = () => {
    if (!horaInicio || !horaFim) return false;
    const newStart = parseInt(horaInicio.split(':')[0], 10);
    const newEnd = parseInt(horaFim.split(':')[0], 10);
    return reservasDia.some((r) => {
      const rStart = parseInt((r.horaInicio || r.hora_inicio).split(':')[0], 10);
      const rEnd = parseInt((r.horaFim || r.hora_fim).split(':')[0], 10);
      return newStart < rEnd && newEnd > rStart;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAreaId) {
      setError('Selecione uma area.');
      return;
    }
    if (!data) {
      setError('Selecione uma data.');
      return;
    }
    if (!horaInicio || !horaFim) {
      setError('Selecione o horario de inicio e fim.');
      return;
    }
    if (horaInicio >= horaFim) {
      setError('O horario de inicio deve ser anterior ao horario de fim.');
      return;
    }
    if (hasConflict()) {
      setError('Existe um conflito de horario com outra reserva. Escolha outro horario.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (data < today) {
      setError('A data da reserva nao pode ser no passado.');
      return;
    }

    setSubmitting(true);
    try {
      await reservaService.criar({
        areaId: parseInt(selectedAreaId, 10),
        data,
        horaInicio,
        horaFim,
      });
      setSuccess('Reserva criada com sucesso! Aguardando aprovacao.');
      setTimeout(() => navigate('/minhas-reservas'), 1500);
    } catch (err) {
      const msg = err.response?.data?.erro || err.response?.data?.error || 'Falha ao criar reserva. Tente novamente.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const timeOptions = getTimeOptions();

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/areas" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-container">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Voltar
      </Link>

      <div className="mt-2 rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
        <h2 className="font-headline text-xl font-bold text-on-surface">Nova Reserva</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Preencha os dados para reservar uma area comum
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-xl bg-success-light px-4 py-3 text-sm text-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Area</label>
            <select
              value={selectedAreaId}
              onChange={(e) => {
                setSelectedAreaId(e.target.value);
                setHoraInicio('');
                setHoraFim('');
              }}
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecione uma area</option>
              {areas.map((a) => (
                <option key={a.id || a.id_area} value={a.id || a.id_area}>
                  {a.nome} (Cap. {a.capacidade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-on-surface">Hora Inicio</label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                disabled={!selectedArea}
              >
                <option value="">Selecione</option>
                {timeOptions.slice(0, -1).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-on-surface">Hora Fim</label>
              <select
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                disabled={!selectedArea}
              >
                <option value="">Selecione</option>
                {timeOptions.slice(1).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Existing reservations for selected date */}
          {reservasDia.length > 0 && (
            <div className="rounded-xl bg-warning-light p-4">
              <p className="mb-2 text-sm font-medium text-warning">
                Horarios ocupados nesta data:
              </p>
              {reservasDia.map((r, i) => (
                <p key={i} className="text-xs text-on-surface-variant">
                  {r.horaInicio || r.hora_inicio} - {r.horaFim || r.hora_fim} ({r.status})
                </p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
          >
            {submitting ? <LoadingSpinner size="sm" /> : 'Confirmar Reserva'}
          </button>
        </form>
      </div>
    </div>
  );
}
