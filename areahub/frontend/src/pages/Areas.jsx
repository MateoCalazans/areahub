/**
 * Página de Áreas
 * Responsável pela listagem e gerenciamento de áreas comuns
 */

import { useState, useEffect } from 'react';
import AreaCard from '../components/areas/AreaCard';
import areaService from '../services/areaService';

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await areaService.listar();
        setAreas(response.areas || []);
      } catch (err) {
        setError('Falha ao carregar áreas');
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Áreas Comuns</h1>
      {areas.length === 0 ? (
        <p>Nenhuma área disponível</p>
      ) : (
        <div>
          {areas.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Areas;
