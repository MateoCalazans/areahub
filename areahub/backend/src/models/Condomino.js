/**
 * Model de Condomínio
 * Responsável por interação com tabela 'condominos' no banco de dados
 */

const pool = require('../config/database');

class Condomino {
  // Buscar condomínio por ID
  static async buscarPorId(id) {
    try {
      const result = await pool.query('SELECT * FROM condominos WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os condomínios
  static async listar() {
    try {
      const result = await pool.query('SELECT * FROM condominos');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Criar novo condomínio
  static async criar(nome, endereco, sindico_id) {
    try {
      const result = await pool.query(
        'INSERT INTO condominos (nome, endereco, sindico_id) VALUES ($1, $2, $3) RETURNING *',
        [nome, endereco, sindico_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Atualizar condomínio
  static async atualizar(id, updates) {
    try {
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updates);
      const result = await pool.query(
        `UPDATE condominos SET ${fields} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Deletar condomínio
  static async deletar(id) {
    try {
      await pool.query('DELETE FROM condominos WHERE id = $1', [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Condomino;
