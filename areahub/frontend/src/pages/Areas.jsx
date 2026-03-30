import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import areaService from '../services/areaService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function Areas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAreas() {
      try {
        const response = await areaService.listar();
        setAreas(response.areas || response || []);
      } catch {
        setError('Falha ao carregar areas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    fetchAreas();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  if (error) {
    return (
      <div className="rounded-xl bg-error-container p-4 text-sm text-on-error-container">
        {error}
      </div>
    );
  }

  const areasList = Array.isArray(areas) ? areas : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Areas Disponiveis</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Confira as areas comuns do condominio</p>
        </div>
      </div>

      {areasList.length === 0 ? (
        <EmptyState icon="location_off" message="Nenhuma area disponivel" description="Nao ha areas cadastradas no momento" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areasList.map((area) => (
            <div
              key={area.id || area.id_area}
              className="flex flex-col rounded-xl bg-surface-container-lowest p-5 shadow-ambient transition-shadow hover:shadow-ambient-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed">
                  <span className="material-symbols-outlined text-xl text-primary">meeting_room</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    area.ativa
                      ? 'bg-success-light text-success'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {area.ativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              <h3 className="mt-3 font-headline text-base font-semibold text-on-surface">
                {area.nome}
              </h3>
              {area.descricao && (
                <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">
                  {area.descricao}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">group</span>
                  {area.capacidade} pessoas
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {area.horarioAbertura || area.horario_abertura} - {area.horarioFechamento || area.horario_fechamento}
                </span>
              </div>

              <div className="mt-4 flex gap-2 pt-2">
                <Link
                  to={`/areas/${area.id || area.id_area}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-container-high px-3 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-highest"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Ver Disponibilidade
                </Link>
                {user?.role === 'CONDOMINO' && area.ativa && (
                  <Link
                    to={`/reservas/nova/${area.id || area.id_area}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-on-primary transition-colors hover:bg-primary-container"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Reservar
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
