/**
 * Model de Área Comum
 * Responsável por interação com tabela 'areas' no banco de dados
 */

const pool = require('../config/database');

class Area {
  // Buscar área por ID
  static async buscarPorId(id) {
    try {
      const result = await pool.query('SELECT * FROM areas WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Listar todas as áreas
  static async listar() {
    try {
      const result = await pool.query('SELECT * FROM areas');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Listar áreas por condomínio
  static async listarPorCondominio(condominio_id) {
    try {
      const result = await pool.query('SELECT * FROM areas WHERE condominio_id = $1', [condominio_id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Criar nova área
  static async criar(nome, descricao, condominio_id, capacidade) {
    try {
      const result = await pool.query(
        'INSERT INTO areas (nome, descricao, condominio_id, capacidade) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, descricao, condominio_id, capacidade]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Atualizar área
  static async atualizar(id, updates) {
    try {
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updates);
      const result = await pool.query(
        `UPDATE areas SET ${fields} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Deletar área
  static async deletar(id) {
    try {
      await pool.query('DELETE FROM areas WHERE id = $1', [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Area;
