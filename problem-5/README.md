# 99gate API

This is a backend REST API project for managing products, built with Express, TypeScript, and TypeORM. It uses PostgreSQL as the database and runs in a Dockerized environment.

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Programming language
- **TypeORM** - ORM for database operations
- **PostgreSQL** - Relational database
- **Docker** - Containerization
- **Swagger** - API Documentation
- **Jest & Supertest** - Unit & Integration Testing
- **Helmet** - Security headers
- **CORS** - Cross-Origin Resource Sharing

## Prerequisites

- Node.js (v18+ recommended)
- Docker & Docker Compose

## Project Structure

```
.
├── database/            # Docker database configuration
│   ├── pg_hba.conf
│   └── postgresql.conf
├── src/
│   ├── controller/      # Request handlers
│   │   └── ProductController.ts
│   ├── dto/             # Data Transfer Objects
│   │   ├── CreateProduct.dto.ts
│   │   └── UpdateProduct.dto.ts
│   ├── entity/          # TypeORM entities
│   │   └── Product.ts
│   ├── middleware/      # Express middlewares
│   │   ├── LoggerMiddleware.ts
│   │   └── ValidationMiddleware.ts
│   ├── migration/       # Database migrations
│   ├── __tests__/       # Unit & Integration Tests
│   │   └── ProductController.test.ts
│   ├── data-source.ts   # Database connection config
│   ├── app.ts           # Express App Definition
│   ├── index.ts         # Application entry point
│   ├── routes.ts        # Route definitions
│   └── swagger.ts       # Swagger configuration
├── .env                 # Environment variables
├── docker-compose.yml   # Docker services config
├── jest.config.js       # Jest configuration
├── package.json
└── tsconfig.json
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```bash
# Application Database Configuration
DB_HOST=localhost
DB_PORT=5632
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb

# Docker Database Configuration
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb
```

### 3. Start Database
Start the PostgreSQL container:
```bash
docker-compose up -d postgres
```

### 4. Run Migrations
Initialize the schema:
```bash
npm run migration:run
```

### 5. Run Development Server
```bash
npm run dev
```
The server will start on [http://localhost:3001](http://localhost:3001).

## API Documentation

Interactive API documentation is available via Swagger UI:
👉 [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### Endpoints Overview

#### 1. Get All Products
```http
GET /products
```
**Response (Success - 200):**
Returns a list of all products.

#### 2. Get Product by ID
```http
GET /products/:id
```
**Response (Success - 200):**
Returns a single product object.
**Response (Error - 404):**
`"unregistered product"`

#### 3. Create Product
```http
POST /products
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Product Name",
  "price": 100,
  "description": "Product Description"
}
```

#### 4. Update Product
```http
PUT /products/:id
Content-Type: application/json
```
**Body:** (Partial updates supported)
```json
{
  "name": "Updated Name",
  "price": 150
}
```

#### 5. Delete Product
```http
DELETE /products/:id
```

## Testing

This project uses **Jest** and **Supertest** for unit and integration testing.

### Running Tests
Run the full test suite with:

```bash
npm test
```

The tests are located in `src/__tests__/` and cover all API endpoints in `ProductController`.

## Scripts

- `npm run dev` - Start development server (hot-reload)
- `npm run build` - Compile TypeScript
- `npm start` - Start production build
- `npm test` - Run unit tests
- `npm run migration:generate <path>` - Generate migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert migration

## License
MIT
