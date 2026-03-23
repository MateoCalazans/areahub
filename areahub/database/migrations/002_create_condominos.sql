/**
 * Migration 002: Criar tabela de Condomínios
 * Cria a tabela condominos com informações do condomínio
 */

CREATE TABLE condominos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  sindico_id INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para buscar por síndico
CREATE INDEX idx_condominos_sindico_id ON condominos(sindico_id);
