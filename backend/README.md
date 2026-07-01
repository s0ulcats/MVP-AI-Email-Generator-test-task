# AI Email Generator Backend

A production-ready NestJS backend for an AI-powered email generation SaaS application. Features JWT authentication, subscription management, plan-based rate limiting, and a modular AI provider architecture.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (access + refresh tokens) with Passport.js
- **Password Hashing**: bcrypt
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler
- **Containerization**: Docker + Docker Compose

## Features

- **Auth Module**: User registration, login, logout, token refresh
- **Users Module**: Profile management (get/update)
- **Email Generation Module**: AI-powered email generation with plan-based limits
- **Subscription Module**: Plan management (Free/Pro/Premium)
- **Modular AI Provider**: Easy swap between Mock, OpenAI, or Anthropic providers
- **Global Exception Handling**: Consistent error responses
- **Request Logging**: Automatic request/response time logging
- **Rate Limiting**: Configurable throttling on sensitive endpoints

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data transfer objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                   # User management module
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── email-generation/        # Email generation module
│   ├── dto/
│   ├── interfaces/         # AI provider interface
│   ├── providers/          # AI provider implementations
│   ├── constants/          # Dependency injection tokens
│   ├── email-generation.controller.ts
│   ├── email-generation.service.ts
│   └── email-generation.module.ts
├── subscription/            # Subscription management module
│   ├── dto/
│   ├── subscription.controller.ts
│   ├── subscription.service.ts
│   └── subscription.module.ts
├── common/                  # Shared utilities
│   ├── filters/            # Global exception filter
│   ├── interceptors/       # Logging interceptor
│   ├── guards/             # JWT auth, plan limit guards
│   └── decorators/         # Custom decorators
├── prisma/                  # Database service
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_email_generator?schema=public"
JWT_ACCESS_SECRET="your-super-secret-access-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
PORT=3000
FRONTEND_URL="http://localhost:3001"
AI_PROVIDER="mock"
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
```

## Local Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. (Optional) Seed the database with a demo user:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api/docs`

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker Setup

### Using Docker Compose

1. Build and start all services:
```bash
docker-compose up --build
```

This will:
- Start PostgreSQL with health checks
- Build the NestJS application
- Wait for PostgreSQL to be ready before starting the API
- Run migrations on startup

2. Access the API:
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

3. Stop services:
```bash
docker-compose down
```

4. Stop services and remove volumes:
```bash
docker-compose down -v
```

### Manual Docker Build

1. Build the image:
```bash
docker build -t ai-email-generator-backend .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env ai-email-generator-backend
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive tokens
- `POST /auth/logout` - Invalidate refresh token
- `POST /auth/refresh` - Refresh access token

### Users

- `GET /users/me` - Get current user profile (protected)
- `PATCH /users/me` - Update current user profile (protected)

### Email Generation

- `POST /generate` - Generate an email (protected, rate-limited)
- `GET /generate/history?limit=10` - Get generation history (protected)

### Subscription

- `GET /subscription` - Get current subscription (protected)
- `POST /subscription/upgrade` - Upgrade plan (protected)

## Plan Limits

- **Free**: 5 generations per month
- **Pro**: Unlimited generations
- **Premium**: Unlimited generations

## AI Provider Architecture

The application uses a modular AI provider architecture. To switch providers:

1. Implement the `AIProvider` interface:
```typescript
interface AIProvider {
  generate(topic: string, tone: Tone, length: Length): Promise<string>;
}
```

2. Update the provider factory in `email-generation.module.ts`
3. Set the `AI_PROVIDER` environment variable

Currently implemented:
- **MockAIProvider**: Template-based generation with artificial delay (default)

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT access tokens (15min expiration)
- JWT refresh tokens (7day expiration)
- Refresh tokens stored in database with expiration
- CORS configured for frontend origin
- Rate limiting on auth and generation endpoints
- Input validation with class-validator
- Global exception filter prevents stack trace leaks

## Database Schema

### User
- id, email, passwordHash, name, plan, createdAt, updatedAt

### Generation
- id, userId, topic, tone, length, content, createdAt

### RefreshToken
- id, token, userId, expiresAt, createdAt

### Enums
- Plan: FREE, PRO, PREMIUM
- Tone: PROFESSIONAL, CASUAL, FRIENDLY, FORMAL, PERSUASIVE
- Length: SHORT, MEDIUM, LONG

## Development Scripts

```bash
npm run build          # Build for production
npm run start          # Start production server
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start in debug mode
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
npm run seed           # Seed database with demo user
```