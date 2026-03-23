/**
 * Migration 004: Criar tabela de Reservas
 * Cria a tabela reservas com informações das reservas de áreas comuns
 */

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  area_id INTEGER NOT NULL REFERENCES areas(id),
  data_inicio TIMESTAMP NOT NULL,
  data_fim TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para buscas comuns
CREATE INDEX idx_reservas_usuario_id ON reservas(usuario_id);
CREATE INDEX idx_reservas_area_id ON reservas(area_id);
CREATE INDEX idx_reservas_status ON reservas(status);
CREATE INDEX idx_reservas_data_inicio ON reservas(data_inicio);
