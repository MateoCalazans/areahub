import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import reservaService from '../services/reservaService';
import areaService from '../services/areaService';
import usuarioService from '../services/usuarioService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

function StatCard({ icon, label, value, color = 'bg-primary' }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <span className="material-symbols-outlined text-xl text-on-primary">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-on-surface-variant">{label}</p>
          <p className="font-headline text-2xl font-bold text-on-surface">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CondomiloDashboard({ user }) {
  const [reservas, setReservas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resReservas, resAreas] = await Promise.all([
          reservaService.listar(),
          areaService.listar(),
        ]);
        setReservas(resReservas.reservas || resReservas || []);
        setAreas(resAreas.areas || resAreas || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const minhasReservas = Array.isArray(reservas) ? reservas : [];
  const totalReservas = minhasReservas.length;
  const proximaReserva = minhasReservas
    .filter((r) => r.status === 'APROVADA' || r.status === 'PENDENTE')
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .find((r) => new Date(r.data) >= new Date(new Date().toDateString()));
  const areasAtivas = (Array.isArray(areas) ? areas : []).filter((a) => a.ativa).length;

  return (
    <div>
      <h2 className="font-headline text-2xl font-bold text-on-surface">
        Bem-vindo, {user?.nome || 'Usuario'}!
      </h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Confira o resumo das suas reservas
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon="event_note" label="Minhas Reservas" value={totalReservas} />
        <StatCard
          icon="calendar_today"
          label="Proxima Reserva"
          value={proximaReserva ? new Date(proximaReserva.data).toLocaleDateString('pt-BR') : '-'}
          color="bg-primary-container"
        />
        <StatCard icon="location_city" label="Areas Disponiveis" value={areasAtivas} color="bg-secondary" />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-semibold text-on-surface">Reservas Recentes</h3>
          <Link to="/minhas-reservas" className="text-sm font-medium text-primary hover:text-primary-container">
            Ver todas
          </Link>
        </div>
        {minhasReservas.length === 0 ? (
          <EmptyState icon="event_busy" message="Nenhuma reserva encontrada" description="Faca sua primeira reserva em Areas Disponiveis" />
        ) : (
          <div className="mt-4 space-y-3">
            {minhasReservas.slice(0, 5).map((r) => (
              <div key={r.id || r.id_reserva} className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
                <div>
                  <p className="text-sm font-medium text-on-surface">{r.area?.nome || 'Area'}</p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(r.data).toLocaleDateString('pt-BR')} - {r.horaInicio || r.hora_inicio} ate {r.horaFim || r.hora_fim}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SindicoDashboard() {
  const [reservas, setReservas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resReservas, resAreas] = await Promise.all([
          reservaService.listar(),
          areaService.listar(),
        ]);
        setReservas(resReservas.reservas || resReservas || []);
        setAreas(resAreas.areas || resAreas || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAprovar = async (id) => {
    try {
      await reservaService.aprovar(id);
      setReservas((prev) => prev.map((r) => ((r.id || r.id_reserva) === id ? { ...r, status: 'APROVADA' } : r)));
    } catch { /* ignore */ }
  };

  const handleRejeitar = async (id) => {
    try {
      await reservaService.rejeitar(id, 'Rejeitada pelo sindico');
      setReservas((prev) => prev.map((r) => ((r.id || r.id_reserva) === id ? { ...r, status: 'REJEITADA' } : r)));
    } catch { /* ignore */ }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const allReservas = Array.isArray(reservas) ? reservas : [];
  const pendentes = allReservas.filter((r) => r.status === 'PENDENTE');
  const hoje = new Date().toDateString();
  const reservasHoje = allReservas.filter((r) => new Date(r.data).toDateString() === hoje);
  const areasAtivas = (Array.isArray(areas) ? areas : []).filter((a) => a.ativa).length;

  return (
    <div>
      <h2 className="font-headline text-2xl font-bold text-on-surface">Painel do Sindico</h2>
      <p className="mt-1 text-sm text-on-surface-variant">Acompanhe as reservas e areas do condominio</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon="pending_actions" label="Reservas Pendentes" value={pendentes.length} color="bg-warning" />
        <StatCard icon="today" label="Reservas Hoje" value={reservasHoje.length} color="bg-primary-container" />
        <StatCard icon="location_city" label="Areas Ativas" value={areasAtivas} color="bg-success" />
      </div>

      <div className="mt-8">
        <h3 className="font-headline text-lg font-semibold text-on-surface">Reservas Pendentes</h3>
        {pendentes.length === 0 ? (
          <EmptyState icon="check_circle" message="Nenhuma reserva pendente" description="Todas as reservas foram processadas" />
        ) : (
          <div className="mt-4 space-y-3">
            {pendentes.slice(0, 10).map((r) => (
              <div key={r.id || r.id_reserva} className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {r.condomino?.usuario?.nome || 'Condomino'} - {r.area?.nome || 'Area'}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(r.data).toLocaleDateString('pt-BR')} - {r.horaInicio || r.hora_inicio} ate {r.horaFim || r.hora_fim}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAprovar(r.id || r.id_reserva)}
                    className="flex items-center gap-1 rounded-lg bg-success-light px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success hover:text-on-error"
                  >
                    <span className="material-symbols-outlined text-base">check</span>
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleRejeitar(r.id || r.id_reserva)}
                    className="flex items-center gap-1 rounded-lg bg-error-container px-3 py-1.5 text-xs font-medium text-on-error-container transition-colors hover:bg-error hover:text-on-error"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [reservas, setReservas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resReservas, resAreas, resUsuarios] = await Promise.all([
          reservaService.listar(),
          areaService.listar(),
          usuarioService.listar(),
        ]);
        setReservas(resReservas.reservas || resReservas || []);
        setAreas(resAreas.areas || resAreas || []);
        setUsuarios(resUsuarios.usuarios || resUsuarios || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const allReservas = Array.isArray(reservas) ? reservas : [];
  const allAreas = Array.isArray(areas) ? areas : [];
  const allUsuarios = Array.isArray(usuarios) ? usuarios : [];
  const pendentes = allReservas.filter((r) => r.status === 'PENDENTE');
  const areasAtivas = allAreas.filter((a) => a.ativa).length;
  const condominos = allUsuarios.filter((u) => u.role === 'CONDOMINO');

  return (
    <div>
      <h2 className="font-headline text-2xl font-bold text-on-surface">Painel Administrativo</h2>
      <p className="mt-1 text-sm text-on-surface-variant">Visao geral do sistema</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="group" label="Total Usuarios" value={allUsuarios.length} />
        <StatCard icon="pending_actions" label="Reservas Pendentes" value={pendentes.length} color="bg-warning" />
        <StatCard icon="location_city" label="Areas Ativas" value={areasAtivas} color="bg-success" />
        <StatCard icon="groups" label="Condominos" value={condominos.length} color="bg-secondary" />
      </div>

      <div className="mt-8">
        <h3 className="font-headline text-lg font-semibold text-on-surface">Atividade Recente</h3>
        {allReservas.length === 0 ? (
          <EmptyState icon="event_busy" message="Nenhuma reserva no sistema" />
        ) : (
          <div className="mt-4 space-y-3">
            {allReservas.slice(0, 8).map((r) => (
              <div key={r.id || r.id_reserva} className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {r.condomino?.usuario?.nome || 'Condomino'} - {r.area?.nome || 'Area'}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(r.data).toLocaleDateString('pt-BR')} - {r.horaInicio || r.hora_inicio} ate {r.horaFim || r.hora_fim}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'ADMINISTRADOR') return <AdminDashboard />;
  if (user?.role === 'SINDICO') return <SindicoDashboard />;
  return <CondomiloDashboard user={user} />;
}
