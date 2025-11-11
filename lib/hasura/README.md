# Hasura GraphQL Integration

## Setup

### 1. Install Hasura CLI

The Hasura CLI npm package has installation issues. Install it globally or use Docker instead:

**Option A: Global Installation (macOS/Linux)**

```bash
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
```

**Option B: Using Docker**

```bash
docker pull hasura/graphql-engine
```

### 2. Initialize Hasura Project

```bash
hasura init hasura --endpoint <YOUR_HASURA_ENDPOINT>
```

### 3. Configure Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT=https://your-hasura-instance.com/v1/graphql
HASURA_ADMIN_SECRET=your-admin-secret
```

## Usage

### Server Components

Use `getClient()` to query Hasura in React Server Components:

```tsx
import { getClient } from "@/lib/hasura/client";
import { GET_USERS } from "@/lib/hasura/queries";

export default async function UsersPage() {
  const client = getClient();
  const { data } = await client.query({ query: GET_USERS });

  return (
    <div>
      {data.users.map((user) => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}
```

### Client Components

Use Apollo hooks with the Apollo Provider:

```tsx
"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/lib/hasura/queries";

export default function UsersList() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.users.map((user) => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}
```

## GraphQL Code Generation

Use GraphQL Code Generator for type-safe queries:

1. Create `codegen.yml`:

```yaml
schema: ${NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT}
documents: "lib/hasura/**/*.ts"
generates:
  lib/hasura/generated.ts:
    plugins:
      - typescript
      - typescript-operations
```

2. Run codegen:

```bash
npx graphql-codegen
```

## Hasura CLI Commands

See CLAUDE.md for common Hasura CLI commands.
