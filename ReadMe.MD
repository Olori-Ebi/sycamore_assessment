# Sycamore Transfer API

A Node.js + Express + Sequelize API for managing wallet transfers and transactions. Supports idempotent transfers, ledger entries, balance updates, and unit tests with Jest.

## Features
- Create wallet-to-wallet transfers with idempotency
- Maintain transaction logs and ledgers for auditability
- Safe arithmetic with decimal.js to prevent floating-point errors
- PostgreSQL database with Sequelize ORM
- Migrations and seed data for development/testing
- Unit tests with Jest

## Tech Stack
- Node.js + Express + TypeScript
- Sequelize ORM + PostgreSQL
- decimal.js for precise money calculations
- dotenv for environment configuration
- Jest for testing

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Olori-Ebi/sycamore_assessment.git
cd sycamore_assessment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a .env file in the project root:

PORT=3000
NODE_ENV=development
POSTGRES_USER=sycamore_user
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=strongpassword
POSTGRES_DB=sycamore_db
POSTGRES_PORT=55432

### 4. Start PostgreSQL with Docker
```bash
    docker compose up
```

### 5. Run migrations and seed data

```bash
    npm run migrate
```

```bash
    npm run seed
```

### 6. Build Start the server
```bash
    npm run build && npm start
```

### To Run Tests
Run
```bash
npm test
```