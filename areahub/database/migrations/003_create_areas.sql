/**
 * Migration 003: Criar tabela de Áreas Comuns
 * Cria a tabela areas com informações das áreas comuns do condomínio
 */

CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  condominio_id INTEGER NOT NULL REFERENCES condominos(id),
  capacidade INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para buscar por condomínio
CREATE INDEX idx_areas_condominio_id ON areas(condominio_id);
