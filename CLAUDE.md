# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- `npm run format:write` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run types` - Run TypeScript type checking
- `npm run clean` - Run both lint and format:write

### Hasura & Database

- `npx hasura console` - Open Hasura console for local development
- `npx hasura migrate create <name>` - Create a new database migration
- `npx hasura migrate apply` - Apply pending migrations
- `npx hasura metadata export` - Export current metadata
- `npx hasura metadata apply` - Apply metadata to Hasura instance
- `npx hasura seed apply` - Apply database seeds

### Testing

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

## Architecture

This is a Next.js 15 template using the App Router with clear separation between authenticated and unauthenticated routes.

### Route Structure

- `/app/(unauthenticated)` - Public routes
  - `(marketing)` - Landing pages (homepage, features, pricing, etc.)
  - `(auth)` - Login and logout flows
- `/app/(authenticated)` - Protected routes requiring password authentication
  - `dashboard` - Main application dashboard
  - Additional protected sections can be added here
- `/app/api` - API routes (file upload, webhooks, etc.)

### Key Patterns

- **Middleware Authentication** - Simple password-based authentication using Next.js middleware
  - Single password stored in environment variable
  - Cookie-based session management
  - Protected routes automatically redirect to login if unauthenticated
  - Public routes (homepage, login) accessible without authentication

- **Hasura GraphQL** - Backend powered by Hasura Cloud with PostgreSQL
  - GraphQL client configured with Apollo Client
  - Server-side queries using `getClient()` for RSC (React Server Components)
  - Client-side queries using `ApolloProvider` wrapper
  - Admin secret for privileged operations
  - Migrations and metadata managed via Hasura CLI

- **Hetzner Object Storage** - S3-compatible object storage for file management
  - AWS SDK v3 client for S3-compatible operations
  - Utilities for upload, download, delete, and list operations
  - Pre-signed URLs for secure file access
  - Multi-part upload support for large files

### Data Flow

1. **Authentication Flow**
   - User visits protected route → Middleware checks auth cookie
   - If unauthenticated → Redirect to `/login`
   - Login form submits → Validates password → Sets HTTP-only cookie
   - User can access protected routes → Logout clears cookie

2. **GraphQL Data Flow**
   - Server Components use `getClient()` to query Hasura directly
   - Client Components use Apollo hooks (`useQuery`, `useMutation`)
   - All requests include admin secret header for authorization
   - Hasura connects to PostgreSQL database

3. **File Storage Flow**
   - Client uploads file → API route receives file
   - Server validates and processes file
   - Upload to Hetzner Object Storage using S3 SDK
   - Store metadata in database via Hasura
   - Generate pre-signed URLs for file access

### Technology Stack

- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Authentication**: Custom middleware with cookie-based sessions
- **Database**: PostgreSQL via Hasura GraphQL Engine
- **Object Storage**: Hetzner Object Storage (S3-compatible)
- **Type Safety**: TypeScript with strict mode
- **Code Quality**: ESLint + Prettier

### Environment Variables Required

#### Authentication

- `AUTH_PASSWORD` - Single password for application access
- `AUTH_SECRET` - Secret key for cookie encryption (generate with `openssl rand -base64 32`)

#### Hasura GraphQL

- `NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT` - Hasura GraphQL endpoint URL
- `HASURA_ADMIN_SECRET` - Admin secret for privileged operations

#### Hetzner Object Storage

- `HETZNER_ACCESS_KEY_ID` - Hetzner S3-compatible access key
- `HETZNER_SECRET_ACCESS_KEY` - Hetzner S3-compatible secret key
- `HETZNER_BUCKET_NAME` - Name of the storage bucket
- `HETZNER_REGION` - Region of the storage bucket (e.g., `eu-central-1`)
- `HETZNER_ENDPOINT` - S3 endpoint URL (e.g., `https://fsn1.your-objectstorage.com`)

## Project Setup

1. **Clone and Install**

   ```bash
   git clone <repo-url>
   cd <project-name>
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   # Fill in all required environment variables
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open http://localhost:3000
   - Use password from `AUTH_PASSWORD` to log in

## Development Guidelines

### Adding New Protected Routes

1. Create route inside `app/(authenticated)/`
2. Middleware will automatically protect it
3. Use `getClient()` to query Hasura in Server Components

### Adding New Public Routes

1. Create route inside `app/(unauthenticated)/(marketing)/`
2. No authentication required
3. Accessible to all visitors

### Working with Hasura

1. Use Hasura console for schema changes: `npx hasura console`
2. Create migrations for all schema changes
3. Export metadata after console changes
4. Commit migrations and metadata to git

### Working with Object Storage

1. Use utilities in `lib/storage/` for all storage operations
2. Always validate file types and sizes before upload
3. Use pre-signed URLs for serving files to clients
4. Store file metadata in database for tracking

### Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Run `npm run clean` before committing
- Ensure `npm run types` passes with no errors
