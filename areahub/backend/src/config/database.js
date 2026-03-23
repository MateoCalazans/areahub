/**
 * Configuração de conexão com PostgreSQL
 * Responsável por gerenciar a pool de conexões com o banco de dados
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'areahub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões', err);
});

module.exports = pool;
