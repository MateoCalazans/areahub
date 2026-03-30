/**
 * Página de Gerenciamento de Usuários
 * Responsável pela listagem e gerenciamento de usuários (apenas admin/síndico)
 */

import { useState, useEffect } from 'react';
import api from '../services/api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data.usuarios || []);
      } catch (err) {
        setError('Falha ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Deseja deletar este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (err) {
        setError('Falha ao deletar usuário');
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Gerenciar Usuários</h1>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário encontrado</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Nome</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Perfil</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{usuario.nome}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{usuario.email}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{usuario.role}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f44336', color: '#fff' }}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Usuarios;
