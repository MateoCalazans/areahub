/**
 * Componente AreaForm
 * Responsável pelo formulário de criação/edição de áreas
 */

import { useState } from 'react';

const AreaForm = ({ onSubmit, area = null }) => {
  const [formData, setFormData] = useState({
    nome: area?.nome || '',
    descricao: area?.descricao || '',
    capacidade: area?.capacidade || '',
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
      <input
        type="text"
        name="nome"
        placeholder="Nome da Área"
        value={formData.nome}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem' }}
      />
      <textarea
        name="descricao"
        placeholder="Descrição"
        value={formData.descricao}
        onChange={handleChange}
        style={{ padding: '0.5rem', minHeight: '100px' }}
      />
      <input
        type="number"
        name="capacidade"
        placeholder="Capacidade"
        value={formData.capacidade}
        onChange={handleChange}
        required
        style={{ padding: '0.5rem' }}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        {area ? 'Atualizar' : 'Criar'} Área
      </button>
    </form>
  );
};

export default AreaForm;
