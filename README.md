# Next.js 15 SaaS Template

A production-ready Next.js 15 template with authentication, Hasura GraphQL, and object storage integration.

## Features

- ✅ **Next.js 15** with App Router and React 19
- ✅ **Tailwind CSS v4** with shadcn/ui components
- ✅ **Password Authentication** with JWT sessions
- ✅ **Hasura GraphQL** for database operations
- ✅ **Hetzner Object Storage** (S3-compatible)
- ✅ **TypeScript** with strict mode
- ✅ **ESLint + Prettier** for code quality
- ✅ **Route Groups** for authenticated/unauthenticated flows

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Authentication
AUTH_PASSWORD=your-secure-password
AUTH_SECRET=your-secret-key  # Generate with: openssl rand -base64 32

# Hasura GraphQL
NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT=https://your-hasura-instance.com/v1/graphql
HASURA_ADMIN_SECRET=your-hasura-admin-secret

# Hetzner Object Storage
HETZNER_ACCESS_KEY_ID=your-access-key
HETZNER_SECRET_ACCESS_KEY=your-secret-key
HETZNER_BUCKET_NAME=your-bucket-name
HETZNER_REGION=eu-central-1
HETZNER_ENDPOINT=https://fsn1.your-objectstorage.com
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and use the password from `AUTH_PASSWORD` to log in.

## Project Structure

```
├── app/
│   ├── (unauthenticated)/       # Public routes
│   │   ├── (marketing)/         # Landing pages
│   │   │   └── page.tsx         # Homepage
│   │   └── (auth)/              # Auth pages
│   │       └── login/           # Login page
│   ├── (authenticated)/         # Protected routes
│   │   ├── layout.tsx           # Auth layout with nav
│   │   └── dashboard/           # Dashboard page
│   └── api/                     # API routes
│       ├── auth/                # Login/logout endpoints
│       └── upload/              # File upload endpoint
├── lib/
│   ├── auth.ts                  # Authentication utilities
│   ├── hasura/                  # Hasura GraphQL client
│   │   ├── client.ts            # Apollo client setup
│   │   └── queries.ts           # Example queries
│   └── storage/                 # Object storage utilities
│       ├── client.ts            # S3 client setup
│       └── utils.ts             # Upload/download functions
├── middleware.ts                # Auth middleware
└── CLAUDE.md                    # Documentation for Claude Code
```

## Available Commands

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format:write` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run types` - Run TypeScript type checking
- `npm run clean` - Run lint and format

### Hasura

- `npx hasura console` - Open Hasura console
- `npx hasura migrate create <name>` - Create migration
- `npx hasura migrate apply` - Apply migrations
- `npx hasura metadata export` - Export metadata

## Authentication

This template uses a simple password-based authentication system:

1. User visits protected route → Redirected to `/login`
2. Login form validates password against `AUTH_PASSWORD`
3. JWT session stored in HTTP-only cookie
4. Middleware protects all routes matching `/dashboard/*`

To add multiple users, consider integrating [Clerk](https://clerk.com) or [Auth.js](https://authjs.dev).

## Database with Hasura

### Server Components (Recommended)

```tsx
import { getClient } from "@/lib/hasura/client";
import { GET_USERS } from "@/lib/hasura/queries";

export default async function UsersPage() {
  const client = getClient();
  const { data } = await client.query({ query: GET_USERS });

  return <div>{/* Render users */}</div>;
}
```

### Client Components

```tsx
"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/lib/hasura/queries";

export default function UsersList() {
  const { data, loading } = useQuery(GET_USERS);
  // ...
}
```

## Object Storage

Upload files to Hetzner Object Storage:

```tsx
import { uploadFile } from "@/lib/storage/utils";

const result = await uploadFile({
  key: "uploads/my-file.pdf",
  body: buffer,
  contentType: "application/pdf",
});
```

Download or get pre-signed URLs:

```tsx
import { getFileUrl } from "@/lib/storage/utils";

const url = await getFileUrl("uploads/my-file.pdf", 3600); // Expires in 1 hour
```

See `lib/storage/README.md` for more examples.

## Adding Routes

### Protected Routes

Create files inside `app/(authenticated)/`:

```tsx
// app/(authenticated)/settings/page.tsx
export default function SettingsPage() {
  return <div>Settings</div>;
}
```

Middleware automatically protects these routes.

### Public Routes

Create files inside `app/(unauthenticated)/(marketing)/`:

```tsx
// app/(unauthenticated)/(marketing)/about/page.tsx
export default function AboutPage() {
  return <div>About</div>;
}
```

## Deployment

### Environment Variables

Ensure all required environment variables are set in your hosting platform.

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm run start
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Database**: [Hasura GraphQL](https://hasura.io) + PostgreSQL
- **Storage**: [Hetzner Object Storage](https://www.hetzner.com/storage/object-storage)
- **Auth**: JWT with [jose](https://github.com/panva/jose)
- **GraphQL**: [Apollo Client](https://www.apollographql.com/docs/react/)

## Next Steps to Use This Template

Once you've set up the template, here are the recommended next steps:

### 1. Generate Authentication Secret

Generate a secure secret for JWT signing:

```bash
openssl rand -base64 32
```

Copy the output and add it to your `.env.local` as `AUTH_SECRET`.

### 2. Set Up Hasura

- Create a Hasura Cloud account or set up a local instance
- Configure your PostgreSQL database
- Add the GraphQL endpoint and admin secret to `.env.local`
- Initialize Hasura CLI (if using migrations):

```bash
hasura init hasura --endpoint <YOUR_HASURA_ENDPOINT>
```

### 3. Configure Object Storage

- Create a Hetzner Object Storage bucket (or use any S3-compatible provider)
- Generate access keys from your provider's dashboard
- Add credentials to `.env.local`
- Test the upload endpoint at `/api/upload`

### 4. Customize the Template

- Update branding in [app/layout.tsx](app/layout.tsx)
- Modify the homepage in [app/(unauthenticated)/(marketing)/page.tsx](<app/(unauthenticated)/(marketing)/page.tsx>)
- Add your database schema and queries in [lib/hasura/queries.ts](lib/hasura/queries.ts)
- Customize the dashboard in [app/(authenticated)/dashboard/page.tsx](<app/(authenticated)/dashboard/page.tsx>)

### 5. Install shadcn/ui Components

Add UI components as needed:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
# etc...
```

### 6. Run Tests and Build

Before deploying, ensure everything works:

```bash
npm run types    # Check TypeScript
npm run lint     # Check linting
npm run build    # Test production build
npm run start    # Test production server
```

### 7. Deploy

Choose your hosting platform:

- **Vercel**: Connect your repo and deploy (recommended for Next.js)
- **Railway**: One-click deploy with environment variables
- **Docker**: Use the included Next.js standalone output

Remember to set all environment variables in your hosting platform's dashboard.

## Learn More

- Read [CLAUDE.md](./CLAUDE.md) for detailed documentation
- See [lib/hasura/README.md](./lib/hasura/README.md) for Hasura setup
- See [lib/storage/README.md](./lib/storage/README.md) for storage examples

## License

MIT
