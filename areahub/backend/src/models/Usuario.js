/**
 * Model de Usuário
 * Responsável por interação com tabela 'usuarios' no banco de dados
 */

const pool = require('../config/database');

class Usuario {
  // Buscar usuário por ID
  static async buscarPorId(id) {
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  static async buscarPorEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os usuários
  static async listar() {
    try {
      const result = await pool.query('SELECT * FROM usuarios');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Criar novo usuário
  static async criar(email, password, name, role = 'condomino') {
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, password, name, role]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  static async atualizar(id, updates) {
    try {
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updates);
      const result = await pool.query(
        `UPDATE usuarios SET ${fields} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário
  static async deletar(id) {
    try {
      await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Usuario;
