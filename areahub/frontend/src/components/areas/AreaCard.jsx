/**
 * Componente AreaCard
 * Responsável pela exibição de uma área comum em formato de card
 */

const AreaCard = ({ area, onReserve }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
      <h3>{area.nome}</h3>
      <p>{area.descricao}</p>
      <p><strong>Capacidade:</strong> {area.capacidade} pessoas</p>
      {onReserve && (
        <button onClick={() => onReserve(area.id)} style={{ padding: '0.5rem 1rem', marginTop: '0.5rem' }}>
          Reservar
        </button>
      )}
    </div>
  );
};

export default AreaCard;
