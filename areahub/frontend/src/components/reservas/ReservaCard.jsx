/**
 * Componente ReservaCard
 * Responsável pela exibição de uma reserva em formato de card
 */

const ReservaCard = ({ reserva, onApprove, onReject, onCancel }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
      <h3>Reserva #{reserva.id}</h3>
      <p><strong>Área:</strong> {reserva.area_nome}</p>
      <p><strong>Usuário:</strong> {reserva.usuario_nome}</p>
      <p><strong>Data Início:</strong> {new Date(reserva.data_inicio).toLocaleDateString()}</p>
      <p><strong>Data Fim:</strong> {new Date(reserva.data_fim).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {reserva.status}</p>
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        {reserva.status === 'pendente' && (
          <>
            {onApprove && (
              <button onClick={() => onApprove(reserva.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: '#fff' }}>
                Aprovar
              </button>
            )}
            {onReject && (
              <button onClick={() => onReject(reserva.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#f44336', color: '#fff' }}>
                Rejeitar
              </button>
            )}
            {onCancel && (
              <button onClick={() => onCancel(reserva.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#FF9800', color: '#fff' }}>
                Cancelar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReservaCard;
