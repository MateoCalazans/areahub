# AreaHub - Sistema de Gerenciamento de Reservas de Áreas Comuns

AreaHub é um sistema web para gerenciar reservas de áreas comuns em condomínios. Permite que moradores façam reservas de áreas, enquanto administradores e síndicos podem gerenciar áreas, usuários e aprovar/rejeitar reservas.

## Tecnologias

- **Backend**: Node.js + Express.js (API REST)
- **Frontend**: React + Vite (SPA)
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **HTTP Client**: Axios

## Estrutura do Projeto

```
areahub/
├── backend/          # API REST Node.js + Express
├── frontend/         # Aplicação React + Vite
├── database/         # Scripts de migração SQL
├── .gitignore
└── README.md
```

## Setup e Instalação

### Pré-requisitos

- Node.js (v16+)
- PostgreSQL (v12+)
- npm ou yarn

### 1. Configurar o Banco de Dados

```bash
# Criar banco de dados
createdb areahub

# Executar migrations (usando um cliente PostgreSQL)
psql -U postgres -d areahub -f database/migrations/001_create_usuarios.sql
psql -U postgres -d areahub -f database/migrations/002_create_condominos.sql
psql -U postgres -d areahub -f database/migrations/003_create_areas.sql
psql -U postgres -d areahub -f database/migrations/004_create_reservas.sql
```

### 2. Configurar o Backend

```bash
cd backend

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
# Importante: Alterar DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET

# Instalar dependências
npm install

# Iniciar servidor (desenvolvimento)
npm run dev

# Servidor rodará em http://localhost:3000
```

### 3. Configurar o Frontend

```bash
cd frontend

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env se necessário (padrão: http://localhost:3000/api)

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Aplicação rodará em http://localhost:5173
```

## Variáveis de Ambiente

### Backend (.env)

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=areahub
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=seu_secret_jwt_aqui_muito_seguro
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000/api
```

## API REST Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout

### Usuários (requer autenticação)
- `GET /api/usuarios` - Listar usuários (admin/síndico)
- `GET /api/usuarios/:id` - Buscar usuário por ID
- `POST /api/usuarios` - Criar usuário (admin)
- `PATCH /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário (admin)

### Áreas (requer autenticação)
- `GET /api/areas` - Listar áreas
- `GET /api/areas/:id` - Buscar área por ID
- `POST /api/areas` - Criar área (admin/síndico)
- `PATCH /api/areas/:id` - Atualizar área (admin/síndico)
- `DELETE /api/areas/:id` - Deletar área (admin/síndico)

### Reservas (requer autenticação)
- `GET /api/reservas` - Listar reservas
- `GET /api/reservas/:id` - Buscar reserva por ID
- `POST /api/reservas` - Criar reserva
- `PATCH /api/reservas/:id` - Atualizar reserva
- `POST /api/reservas/:id/cancelar` - Cancelar reserva
- `POST /api/reservas/:id/aprovar` - Aprovar reserva (admin/síndico)
- `POST /api/reservas/:id/rejeitar` - Rejeitar reserva (admin/síndico)
- `DELETE /api/reservas/:id` - Deletar reserva

## Perfis de Usuário

- **condomino**: Morador comum que pode fazer reservas
- **sindico**: Síndico que pode gerenciar áreas e aprovar/rejeitar reservas
- **admin**: Administrador com acesso total

## Fluxo de Autenticação

1. Usuário faz login com email e senha
2. Servidor valida credenciais e retorna JWT token
3. Cliente armazena token no localStorage
4. Cada requisição inclui o token no header `Authorization: Bearer <token>`
5. Interceptor JWT do Axios injeta token automaticamente
6. Se token expirar, usuário é redirecionado para /login

## Páginas da Aplicação

### Públicas
- `/login` - Login de usuário

### Protegidas (requer autenticação)
- `/dashboard` - Dashboard principal
- `/areas` - Listagem de áreas comuns
- `/minhas-reservas` - Reservas do usuário
- `/reservas` - Todas as reservas (admin/síndico)
- `/usuarios` - Gerenciamento de usuários (admin/síndico)

## Build para Produção

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

## Desenvolvimento

### Backend
Para desenvolvimento com auto-reload, usar:
```bash
cd backend
npm run dev
```

### Frontend
Para desenvolvimento com Hot Module Replacement:
```bash
cd frontend
npm run dev
```

## Status do Projeto

Este é um projeto de estrutura base. Os controllers possuem stubs e precisam de implementação completa da lógica de negócio.

## Licença

ISC

## Autor

Mateo Calazans
