# Wedding Gifts API

Backend da lista de presentes de casamento. Gerencia presentes, convidados, pedidos, pagamentos e webhooks de confirmação.

## Stack

- Node.js + TypeScript
- NestJS 11
- PostgreSQL 16
- TypeORM
- Swagger (documentação automática)
- Docker

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose (para rodar com containers)
- PostgreSQL 16 (se rodar sem Docker)

## Rodando com Docker (recomendado)

```bash
docker compose up -d
```

Isso sobe a API na porta **3001** e o PostgreSQL na porta **5433** (host). O schema do banco é criado automaticamente via `init.sql`.

- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

Para parar:

```bash
docker compose down
```

## Rodando sem Docker

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com os dados do seu PostgreSQL local.

### 3. Criar o banco

Crie o banco `wedding_gifts` e execute o schema:

```bash
psql -U postgres -c "CREATE DATABASE wedding_gifts;"
psql -U postgres -d wedding_gifts -f init.sql
```

### 4. Iniciar em modo desenvolvimento

```bash
npm run start:dev
```

## Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `DATABASE_HOST` | Host do PostgreSQL | `localhost` |
| `DATABASE_PORT` | Porta do PostgreSQL | `5432` |
| `DATABASE_USER` | Usuário do banco | `postgres` |
| `DATABASE_PASSWORD` | Senha do banco | `postgres` |
| `DATABASE_NAME` | Nome do banco | `wedding_gifts` |
| `PORT` | Porta da API | `3001` |
| `PAYMENT_PROVIDER` | Gateway de pagamento (`mock`) | `mock` |
| `WEBHOOK_SECRET` | Secret para validar webhooks | - |

## Endpoints

| Metodo | Rota | Descrição |
|---|---|---|
| `GET` | `/api/gifts` | Lista todos os presentes |
| `GET` | `/api/gifts/:id` | Detalhe de um presente |
| `POST` | `/api/orders` | Cria um pedido |
| `GET` | `/api/payments/:orderId` | Status do pagamento |
| `POST` | `/api/payments/:orderId/confirm` | Confirma pagamento manualmente |
| `POST` | `/api/webhook/payment` | Webhook do gateway de pagamento |

A documentação completa com schemas de request/response está disponível no Swagger em `/docs`.

## Arquitetura

```
src/
  gifts/       # CRUD de presentes
  guests/      # Gerenciamento de convidados (upsert por telefone)
  orders/      # Criação de pedidos com fluxo transacional
  payments/    # Pagamentos, confirmação e gateway abstrato
  webhook/     # Recepção de eventos do gateway
  common/      # Filtros de exceção e interceptors
  config/      # Configuração de banco e validação de env
```

## Gateway de Pagamento

O sistema usa uma interface abstrata (`PaymentGateway`) que permite trocar de provider sem alterar o restante do código. Atualmente há um `MockPaymentProvider` para desenvolvimento. Para integrar com Stripe, MercadoPago ou outro, basta criar uma nova classe que implemente a interface e registrá-la no factory (`payment-gateway.factory.ts`).

## Conectando ao Frontend

O frontend (Next.js) faz proxy de `/api/*` para este backend. Basta criar um `.env.local` no projeto frontend:

```
BACKEND_URL=http://localhost:3001
```
