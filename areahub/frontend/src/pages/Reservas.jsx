/**
 * Página de Todas as Reservas
 * Responsável pela listagem de todas as reservas (apenas admin/síndico)
 */

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ReservaCard from '../components/reservas/ReservaCard';
import reservaService from '../services/reservaService';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await reservaService.listar();
        setReservas(response.reservas || []);
      } catch (err) {
        setError('Falha ao carregar reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const handleApprove = async (id) => {
    try {
      await reservaService.aprovar(id);
      setReservas(reservas.map((r) => (r.id === id ? { ...r, status: 'APROVADA' } : r)));
    } catch (err) {
      setError('Falha ao aprovar reserva');
    }
  };

  const handleReject = async (id) => {
    try {
      await reservaService.rejeitar(id, 'Rejeitada pelo síndico');
      setReservas(reservas.map((r) => (r.id === id ? { ...r, status: 'REJEITADA' } : r)));
    } catch (err) {
      setError('Falha ao rejeitar reserva');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Todas as Reservas</h1>
      {reservas.length === 0 ? (
        <p>Nenhuma reserva encontrada</p>
      ) : (
        <div>
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onApprove={user?.role === 'admin' || user?.role === 'sindico' ? handleApprove : null}
              onReject={user?.role === 'admin' || user?.role === 'sindico' ? handleReject : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservas;
