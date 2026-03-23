/**
 * Componente ReservaForm
 * Responsável pelo formulário de criação/edição de reservas
 */

import { useState } from 'react';

const ReservaForm = ({ onSubmit, areas = [], reserva = null }) => {
  const [formData, setFormData] = useState({
    area_id: reserva?.area_id || '',
    data_inicio: reserva?.data_inicio ? reserva.data_inicio.split('T')[0] : '',
    data_fim: reserva?.data_fim ? reserva.data_fim.split('T')[0] : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <select
        name="area_id"
        value={formData.area_id}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem' }}
      >
        <option value="">Selecione uma Área</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.nome}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="data_inicio"
        value={formData.data_inicio}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem' }}
      />
      <input
        type="date"
        name="data_fim"
        value={formData.data_fim}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem' }}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        {reserva ? 'Atualizar' : 'Criar'} Reserva
      </button>
    </form>
  );
};

export default ReservaForm;
