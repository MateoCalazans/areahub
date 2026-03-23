/**
 * Model de Reserva
 * Responsável por interação com tabela 'reservas' no banco de dados
 */

const pool = require('../config/database');

class Reserva {
  // Buscar reserva por ID
  static async buscarPorId(id) {
    try {
      const result = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Listar todas as reservas
  static async listar() {
    try {
      const result = await pool.query('SELECT * FROM reservas');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Listar reservas por usuário
  static async listarPorUsuario(usuario_id) {
    try {
      const result = await pool.query('SELECT * FROM reservas WHERE usuario_id = $1', [usuario_id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Listar reservas por área
  static async listarPorArea(area_id) {
    try {
      const result = await pool.query('SELECT * FROM reservas WHERE area_id = $1', [area_id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Criar nova reserva
  static async criar(usuario_id, area_id, data_inicio, data_fim) {
    try {
      const result = await pool.query(
        'INSERT INTO reservas (usuario_id, area_id, data_inicio, data_fim, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [usuario_id, area_id, data_inicio, data_fim, 'pendente']
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Atualizar reserva
  static async atualizar(id, updates) {
    try {
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updates);
      const result = await pool.query(
        `UPDATE reservas SET ${fields} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Deletar reserva
  static async deletar(id) {
    try {
      await pool.query('DELETE FROM reservas WHERE id = $1', [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Reserva;
