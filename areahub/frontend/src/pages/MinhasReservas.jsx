/**
 * Página de Minhas Reservas
 * Responsável pela listagem das reservas do usuário autenticado
 */

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ReservaCard from '../components/reservas/ReservaCard';
import reservaService from '../services/reservaService';

const MinhasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await reservaService.listar();
        // Filtrar apenas as reservas do usuário atual
        const minhasReservas = response.reservas?.filter((r) => r.usuario_id === user?.id) || [];
        setReservas(minhasReservas);
      } catch (err) {
        setError('Falha ao carregar suas reservas');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReservas();
    }
  }, [user?.id]);

  const handleCancel = async (id) => {
    try {
      await reservaService.cancelar(id);
      setReservas(reservas.map((r) => (r.id === id ? { ...r, status: 'cancelada' } : r)));
    } catch (err) {
      setError('Falha ao cancelar reserva');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Minhas Reservas</h1>
      {reservas.length === 0 ? (
        <p>Você não possui reservas</p>
      ) : (
        <div>
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MinhasReservas;
